import React, { useState } from "react";
import { Text, View, Pressable, FlatList, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useVideoStore } from "../store/useVideoStore";
import VideoItem from "@/components/VideoItem";
import CropModalContent from "@/components/CropModalContent";

export default function MainScreen() {
  const router = useRouter();
  const videos = useVideoStore((state) => state.videos);
  const [isCropModalVisible, setCropModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-black">
      <View className="absolute bg-white pt-8 pb-2 w-full items-start z-20">
        <Text className="text-black text-2xl left-3 font-bold">
          Video Crop App
        </Text>
      </View>

      <View className="flex-1 pt-20">
        {videos.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-xl">It Looks Empty</Text>
          </View>
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
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 120,
              paddingTop: 20,
            }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={{ bottom: 0 }} className="absolute w-full items-center z-20">
        <Pressable
          onPress={() => setCropModalVisible(true)}
          className="bg-blue-500 px-5 py-3 rounded w-10/12 items-center"
        >
          <Text className="text-white text-lg font-bold">Crop Video</Text>
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCropModalVisible}
        onRequestClose={() => setCropModalVisible(false)}
      >
        <CropModalContent
          onClose={() => setCropModalVisible(false)}
          router={router}
        />
      </Modal>
    </View>
  );
}
