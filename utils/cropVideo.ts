// utils/cropVideo.ts
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";

/**
 * Crops a video using FFMPEG.
 * @param videoUri - The source video file URI.
 * @param startTime - Start time (in seconds) for the 5-second segment.
 * @param duration - Duration (in seconds), which should be 5.
 * @param outputUri - The destination URI for the cropped video.
 * @returns A promise that resolves to the outputUri on success.
 */
export const cropVideo = async (
  videoUri: string,
  startTime: number,
  duration: number,
  outputUri: string
): Promise<string> => {
  // Build the FFMPEG command.
  // Note: We copy the video stream, and re-encode the audio stream to AAC.
  const command = `-i "${videoUri}" -ss ${startTime} -t ${duration} -c:v copy -c:a aac -b:a 128k "${outputUri}"`;
  console.log("Executing FFMPEG command:", command);

  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    console.log("Video cropped successfully:", outputUri);
    return outputUri;
  } else {
    console.error("FFMPEG process failed:", returnCode);
    throw new Error("Video cropping failed");
  }
};
