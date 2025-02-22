// store/useVideoStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Video {
  id: string;
  name: string;
  description: string;
  videoUri: string;
}

interface VideoStore {
  videos: Video[];
  addVideo: (video: Video) => void;
  removeVideo: (id: string) => void;
  updateVideo: (id: string, newData: Partial<Video>) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],
      addVideo: (video: Video) => set({ videos: [...get().videos, video] }),
      removeVideo: (id: string) =>
        set({ videos: get().videos.filter((video) => video.id !== id) }),
      updateVideo: (id: string, newData: Partial<Video>) =>
        set({
          videos: get().videos.map((video) =>
            video.id === id ? { ...video, ...newData } : video
          ),
        }),
    }),
    {
      name: "video-diary-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
