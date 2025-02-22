// app/metadata.tsx
import React, { useState } from "react";
import { Text, View, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { useCropVideo } from "../hooks/useCropVideo";
import { useVideoStore } from "../store/useVideoStore";

export default function MetadataScreen() {
  const router = useRouter();
  const { videoUri, startTime, duration } = useLocalSearchParams<{
    videoUri: string;
    startTime: string;
    duration: string;
  }>();

  // Parse numeric values from query parameters
  const cropStart = parseFloat(startTime);
  const cropDuration = parseFloat(duration);

  // Local state for metadata fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const cropMutation = useCropVideo();
  const { addVideo } = useVideoStore();

  const handleCrop = async () => {
    if (!videoUri) return;

    try {
      // Use expo-file-system's documentDirectory for a writable output path
      const outputUri = `${
        FileSystem.documentDirectory
      }cropped-${Date.now()}.mp4`;

      // Execute the cropping operation
      const croppedVideoUri = await cropMutation.mutateAsync({
        videoUri,
        startTime: cropStart,
        duration: cropDuration,
        outputUri,
      });

      // Add the cropped video along with its metadata to the store
      addVideo({
        id: Date.now().toString(),
        name: name || `Cropped Video ${Date.now()}`,
        description:
          description || `Cropped at ${cropStart}s for ${cropDuration}s`,
        videoUri: croppedVideoUri,
      });

      // Navigate back after successful cropping
      router.back();
    } catch (error) {
      console.error("Cropping failed:", error);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold mb-4">Add Metadata</Text>

      {/* Input for video name */}
      <TextInput
        placeholder="Enter video name"
        value={name}
        onChangeText={setName}
        className="w-72 border border-gray-300 p-2 mb-4 rounded"
      />

      {/* Text area for video description */}
      <TextInput
        placeholder="Enter video description"
        value={description}
        onChangeText={setDescription}
        className="w-72 border border-gray-300 p-2 mb-4 rounded"
        multiline
        numberOfLines={3}
      />

      {/* Button to execute the cropping operation */}
      <Pressable onPress={handleCrop} className="bg-blue-500 px-4 py-2 rounded">
        <Text className="text-white">Crop Video</Text>
      </Pressable>

      <Pressable onPress={() => router.back()} className="mt-4">
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}
