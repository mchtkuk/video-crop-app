import React, { useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Video } from "expo-av";
import { useVideoStore } from "../store/useVideoStore";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormData {
  name: string;
  description: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Video name is required"),
  description: yup.string().required("Video description is required"),
});

export default function DetailsScreen() {
  const router = useRouter();
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const video = useVideoStore((state) =>
    state.videos.find((v) => v.id === videoId)
  );
  const updateVideo = useVideoStore((state) => state.updateVideo);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (video) {
      setValue("name", video.name);
      setValue("description", video.description);
    }
  }, [video, setValue]);

  const onSubmit = (data: FormData) => {
    if (videoId) {
      updateVideo(videoId, {
        name: data.name,
        description: data.description,
      });
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-black justify-center items-center p-4"
    >
      <View className="bg-gray-800 rounded-xl p-4 w-72 shadow-lg">
        <Text className="text-white text-2xl font-bold mb-4 text-center">
          Edit Video Details
        </Text>

        {video && (
          <Video
            source={{ uri: video.videoUri }}
            style={{
              width: "100%",
              height: 180,
              borderRadius: 10,
              marginBottom: 16,
            }}
            useNativeControls
            resizeMode="contain"
          />
        )}

        <Text className="text-gray-300 mb-1">Video Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <TextInput
                placeholder="Enter video name"
                placeholderTextColor="#ccc"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded-md"
              />
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>
          )}
        />

        <Text className="text-gray-300 mb-1">Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-3">
              <TextInput
                placeholder="Enter video description"
                placeholderTextColor="#ccc"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={3}
                className="w-full border border-gray-600 bg-gray-700 text-white p-2 rounded-md"
              />
              {errors.description && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </Text>
              )}
            </View>
          )}
        />

        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="bg-blue-500 rounded-full p-3 w-full items-center mt-2"
        >
          <Text className="text-white text-lg font-bold">Save</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="mt-4 bg-gray-300 rounded-full p-3 w-full items-center"
        >
          <Text className="text-gray-900 text-lg font-bold">Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
