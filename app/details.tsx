// app/details.tsx
import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "../store/useVideoStore";

export default function DetailsScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const video = useVideoStore((state) =>
    state.videos.find((v) => v.id === videoId)
  );
  const updateVideo = useVideoStore((state) => state.updateVideo);

  const [name, setName] = useState(video?.name || "");
  const [description, setDescription] = useState(video?.description || "");

  useEffect(() => {
    if (video) {
      setName(video.name);
      setDescription(video.description);
    }
  }, [video]);

  const handleSave = () => {
    if (videoId) {
      updateVideo(videoId, { name, description });
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-black justify-center items-center p-6">
      <View className="w-full max-w-md">
        <Text className="text-white text-2xl font-bold mb-4 text-center">
          Edit Video Details
        </Text>
        <Text className="text-gray-300 mb-2">Video Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter video name"
          placeholderTextColor="#888"
          className="w-full border border-gray-500 bg-gray-800 text-white p-2 mb-4 rounded"
        />
        <Text className="text-gray-300 mb-2">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
          className="w-full border border-gray-500 bg-gray-800 text-white p-2 mb-4 rounded"
        />
        <Pressable onPress={handleSave} className="bg-blue-500 rounded p-3">
          <Text className="text-white text-center font-semibold">Save</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500 text-center">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
