// VideoItem.tsx
import React from "react";
import { Text, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useVideoStore } from "../store/useVideoStore";

interface VideoItemProps {
  id: string;
  name: string;
  description: string;
  videoUri: string;
}

export default function VideoItem({
  id,
  name,
  description,
  videoUri,
}: VideoItemProps) {
  const router = useRouter();
  // Create a player instance for the current item.
  const itemPlayer = useVideoPlayer(videoUri, (player) => {
    player.pause();
  });

  // Get the removeVideo function from your video store.
  const removeVideo = useVideoStore((state) => state.removeVideo);

  const handleDelete = () => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeVideo(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="relative bg-gray-800 p-4 rounded-lg mb-4 shadow-lg">
      {/* Video Preview using the item-specific player */}
      <VideoView
        style={{ width: 300, height: 150 }}
        player={itemPlayer}
        allowsFullscreen
        allowsPictureInPicture
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-5">
        <Pressable
          onPress={() => router.push(`./details?videoId=${id}`)}
          className="bg-white px-4 py-2 rounded"
        >
          <Text className="text-black font-bold text-xs">Edit</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          className="bg-red-500 px-4 py-2 rounded"
        >
          <Text className="text-white font-bold text-xs">Delete</Text>
        </Pressable>
      </View>

      {/* Video Details */}
      <Text className="text-white text-lg font-bold mt-2">
        Video Name: {name}
      </Text>
      <Text className="text-white text-base mt-1">
        Description: {description}
      </Text>
    </View>
  );
}
