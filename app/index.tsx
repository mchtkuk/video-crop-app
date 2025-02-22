// app/index.tsx
import React from "react";
import { Text, View, Pressable, FlatList } from "react-native";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import { useVideoStore } from "../store/useVideoStore";
import VideoItem from "@/components/VideoItem";

export default function MainScreen() {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);

  return (
    <View className="flex-1 bg-black relative">
      {/* Background Video */}
      <Video
        source={require("../assets/videos/background.mp4")}
        className="absolute inset-0"
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
        shouldPlay
        isLooping
        isMuted
      />

      {/* Dark Overlay */}
      <View className="absolute inset-0 bg-black opacity-50" />

      {/* Foreground Content */}
      <View
        className="absolute inset-0 flex flex-col justify-between p-4"
        style={{ zIndex: 10 }}
      >
        {/* Top: Title */}
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-3xl font-bold mt-[15%]">5S App</Text>
          {/* You could add any global top-right button here if needed */}
        </View>

        {/* Middle: Cropped Videos List */}
        <View className="flex-1 justify-center items-center">
          {videos.length === 0 ? (
            <Text className="text-white text-xl">No Cropped Videos</Text>
          ) : (
            <FlatList
              data={videos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <VideoItem
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  videoUri={item.videoUri}
                />
              )}
              contentContainerStyle={{ alignItems: "center", marginTop: 20 }}
            />
          )}
        </View>

        {/* Bottom: Let's Start Button */}
        <View className="items-center">
          <Pressable
            onPress={() => router.push("./cropModal")}
            className="bg-white px-10 py-3 rounded"
          >
            <Text className="text-black text-lg font-bold">Let's Start</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
