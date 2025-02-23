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

  const itemPlayer = useVideoPlayer(videoUri, (player) => {
    player.pause();
  });

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
    <View className="relative bg-white p-4 rounded-xl mb-6 shadow-lg w-80">
      <View className="flex-row justify-between mt-4 mb-4">
        <Pressable
          onPress={() => router.push(`./details?videoId=${id}`)}
          className="bg-blue-500 px-3 py-2 w-24 rounded-sm items-center"
        >
          <Text className="text-white text-xs font-bold">Edit</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          className="bg-red-500 px-3 py-2 w-24 rounded-sm items-center"
        >
          <Text className="text-white text-xs font-bold">Delete</Text>
        </Pressable>
      </View>
      <VideoView
        style={{ width: "100%", height: 150, borderRadius: 8 }}
        player={itemPlayer}
        allowsFullscreen
        allowsPictureInPicture
      />

      <Text className="text-black text-lg font-bold mt-3">{name}</Text>
      <Text className="text-black text-sm mt-1">{description}</Text>
    </View>
  );
}
