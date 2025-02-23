import React, { useState, useRef } from "react";
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { Video } from "expo-av";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

interface CropModalContentProps {
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}

export default function CropModalContent({
  onClose,
  router,
}: CropModalContentProps) {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const segmentDuration = 5;
  const videoRef = useRef<Video>(null);

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

  const handleVideoLoad = (data: { durationMillis: number }) => {
    setVideoDuration(data.durationMillis / 1000);
  };

  const getVideoTitle = (uri: string) => {
    const parts = uri.split("/");
    return parts[parts.length - 1];
  };

  const handleNext = async () => {
    setIsLoading(true);
    router.push(
      `/metadata?videoUri=${encodeURIComponent(
        videoUri ?? ""
      )}&startTime=${startTime}&duration=${segmentDuration}`
    );
    onClose();
    setIsLoading(false);
  };

  return (
    <View className="flex-1 bg-black justify-center items-center p-6">
      <Text className="text-2xl font-extrabold mb-6 text-white">
        {!videoUri ? "Crop Video" : ""}
      </Text>

      {!videoUri ? (
        <Pressable
          onPress={pickVideo}
          className="bg-white px-6 py-3 rounded-full mb-6"
        >
          <Text className="text-black text-lg font-bold">Select Video</Text>
        </Pressable>
      ) : (
        <View className="bg-black rounded-xl p-6 w-11/12 max-w-lg">
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={{ width: "100%", height: 220, borderRadius: 10 }}
            useNativeControls
            resizeMode="contain"
            onLoad={({ durationMillis }) => handleVideoLoad({ durationMillis })}
          />
          <View className="mt-4">
            <Text className="text-white text-lg font-bold">
              Title: {getVideoTitle(videoUri)}
            </Text>
            <Text className="text-white text-base mt-1">
              Duration: {videoDuration.toFixed(1)} seconds
            </Text>
          </View>
          {videoDuration > 0 && videoDuration < 10 ? (
            <Text className="mt-4 text-red-500 font-semibold">
              Video must be at least 10 seconds long to edit.
            </Text>
          ) : videoDuration >= 10 ? (
            <>
              <View className="mt-6 p-4 w-full">
                <Text className="mb-2 text-white text-center font-bold">
                  Segment: {startTime.toFixed(1)}s -{" "}
                  {(startTime + segmentDuration).toFixed(1)}s
                </Text>
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={
                    videoDuration > segmentDuration
                      ? videoDuration - segmentDuration
                      : 0
                  }
                  value={startTime}
                  onSlidingComplete={setStartTime}
                  minimumTrackTintColor="#2563EB"
                  maximumTrackTintColor="#94A3B8"
                  thumbTintColor="#2563EB"
                />
              </View>
              <Pressable
                onPress={handleNext}
                className=" bg-blue-600 px-6 py-3 rounded-full w-full items-center"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white text-lg font-bold">Next</Text>
                )}
              </Pressable>
            </>
          ) : null}
        </View>
      )}
      <Pressable
        onPress={onClose}
        className="mt-6 bg-gray-200 px-6 py-3 rounded-full absolute top-8 left-6"
      >
        <Text className="text-gray-900 font-bold">Back</Text>
      </Pressable>
    </View>
  );
}
