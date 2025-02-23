import { useMutation } from "@tanstack/react-query";
import { cropVideo } from "../utils/cropVideo";

interface CropParams {
  videoUri: string;
  startTime: number;
  duration: number;
  outputUri: string;
}

export const useCropVideo = () => {
  return useMutation({
    mutationFn: async ({
      videoUri,
      startTime,
      duration,
      outputUri,
    }: CropParams) => {
      return cropVideo(videoUri, startTime, duration, outputUri);
    },
  });
};
