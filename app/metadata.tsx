import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { useCropVideo } from "../hooks/useCropVideo";
import { useVideoStore } from "../store/useVideoStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  name: string;
  description: string;
}

const metadataSchema = yup.object().shape({
  name: yup.string().required("Video name is required"),
  description: yup.string().required("Video description is required"),
});

export default function MetadataScreen() {
  const router = useRouter();
  const { videoUri, startTime, duration } = useLocalSearchParams<{
    videoUri: string;
    startTime: string;
    duration: string;
  }>();

  // Parse numeric values from query parameters.
  const cropStart = parseFloat(startTime);
  const cropDuration = parseFloat(duration);

  const cropMutation = useCropVideo();
  const { addVideo } = useVideoStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(metadataSchema),
    defaultValues: { name: "", description: "" },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!videoUri) return;
    try {
      setIsLoading(true);
      const outputUri = `${
        FileSystem.documentDirectory
      }cropped-${Date.now()}.mp4`;
      const croppedVideoUri = await cropMutation.mutateAsync({
        videoUri,
        startTime: cropStart,
        duration: cropDuration,
        outputUri,
      });
      addVideo({
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        videoUri: croppedVideoUri,
      });
      router.push("/");
    } catch (error) {
      console.error("Cropping failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black justify-center items-center p-6">
      <View className="bg-gray-800 rounded-xl p-6 w-80 shadow-lg">
        <Text className="text-white text-3xl font-extrabold mb-6 text-center">
          Add Metadata
        </Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <TextInput
                placeholder="Enter video name"
                placeholderTextColor="#ccc"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                className="w-full border border-gray-600 bg-gray-700 text-white p-3 rounded-md"
              />
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-4">
              <TextInput
                placeholder="Enter video description"
                placeholderTextColor="#ccc"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={3}
                className="w-full border border-gray-600 bg-gray-700 text-white p-3 rounded-md"
              />
              {errors.description && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </Text>
              )}
            </View>
          )}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#1EB1FC" />
        ) : (
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-blue-600 rounded-full p-3 w-full items-center mt-4"
          >
            <Text className="text-white text-lg font-bold">Crop Video</Text>
          </Pressable>
        )}
        <Pressable
          onPress={() => router.back()}
          className="mt-4 bg-gray-300 rounded-full p-3 w-full items-center"
        >
          <Text className="text-gray-900 text-lg font-bold">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}
