// app/cropModal.tsx
import React, { useState, useRef } from "react";
import { Text, View, Pressable } from "react-native";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function CropModal() {
  const router = useRouter();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const segmentDuration = 5; // Fixed 5-second segment
  const videoRef = useRef<Video>(null);

  // Launch video picker (videos only)
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  // Capture video duration when loaded
  const handleVideoLoad = (data: { durationMillis: number }) => {
    setVideoDuration(data.durationMillis / 1000);
  };

  // Extract a simple title from the video URI (filename)
  const getVideoTitle = (uri: string) => {
    const parts = uri.split("/");
    return parts[parts.length - 1];
  };

  // Proceed to the next step (e.g., metadata input)
  const handleNext = () => {
    // Pass along selected segment details as needed
    router.push(
      `/metadata?videoUri=${encodeURIComponent(
        videoUri ?? ""
      )}&startTime=${startTime}&duration=${segmentDuration}`
    );
  };

  return (
    <View className="flex-1 bg-black justify-center items-center p-4">
      <Text className="text-2xl font-bold text-white mb-4">Crop Video</Text>

      {!videoUri ? (
        <Pressable
          onPress={pickVideo}
          className="bg-white px-4 py-2 rounded mb-4"
        >
          <Text>Select Video</Text>
        </Pressable>
      ) : (
        <>
          {/* Video Preview */}
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={{ width: 300, height: 200, backgroundColor: "white" }}
            useNativeControls
            resizeMode="contain"
            onLoad={({ durationMillis }) => handleVideoLoad({ durationMillis })}
          />

          {/* Display Video Title and Duration */}
          <View className="mt-4">
            <Text className="text-lg text-white">
              Title: {getVideoTitle(videoUri)}
            </Text>
            <Text className="text-lg text-white">
              Duration: {videoDuration.toFixed(1)} seconds
            </Text>
          </View>

          {/* Check if video duration meets the minimum requirement */}
          {videoDuration < 10 ? (
            <Text className="mt-4  text-red-500">
              Video must be at least 10 seconds long to edit.
            </Text>
          ) : (
            <>
              {/* Scrubber (Slider) to select the start time */}
              <View className="mt-4" style={{ width: 300 }}>
                <Text className="mb-2 text-white text-center">
                  Segment: {startTime.toFixed(1)}s -{" "}
                  {(startTime + segmentDuration).toFixed(1)}s
                </Text>
                <Slider
                  style={{ width: 300, height: 40 }}
                  minimumValue={0}
                  maximumValue={
                    videoDuration > segmentDuration
                      ? videoDuration - segmentDuration
                      : 0
                  }
                  value={startTime}
                  onValueChange={setStartTime}
                  minimumTrackTintColor="#1EB1FC"
                  maximumTrackTintColor="#8E8E93"
                  thumbTintColor="#1EB1FC"
                />
              </View>

              {/* Next Button */}
              <Pressable
                onPress={handleNext}
                className="mt-8 bg-blue-500 px-4 py-2 rounded"
              >
                <Text className="text-white">Next</Text>
              </Pressable>
            </>
          )}
        </>
      )}

      <Pressable onPress={() => router.back()} className="mt-4">
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}
