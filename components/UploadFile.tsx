import { Button } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import React from "react";
import { View, Text } from "react-native";

export default function UploadRecording({ uri }: { uri: string }) {
  const generateUploadUrl = useMutation(api.recordings.generateUploadUrl);
  const saveRecording = useMutation(api.recordings.saveRecording);
  const { user } = useUser();
  const [progress, setProgress] = React.useState("Not started");

  async function uploadAndSaveRecording() {
    setProgress("Fetching audio");
    const postUrl = await generateUploadUrl();
    const fileData = await fetch(uri);
    if (!fileData.ok) {
      console.error("Error loading file", fileData);
    }
    const blob = await fileData.blob();

    setProgress("Sending file...");
    console.log("Form Data created");
    try {
      // https://stackoverflow.com/questions/35711724/upload-progress-indicators-for-fetch
      // A bunch of code here for using streams to track progress
      // Streams don't actually work in React Native. Will have to use a
      // polyfill described here: https://stackoverflow.com/questions/56207968/stream-api-with-fetch-in-a-react-native-app/77089139#77089139
      // let bytesUploaded = 0;
      // const totalBytes = blob.size;
      // const progressTrackingStream = new TransformStream({
      //   transform(chunk, controller) {
      //     controller.enqueue(chunk);
      //     bytesUploaded += chunk.byteLength;
      //     console.log("upload progress:", bytesUploaded / totalBytes);
      //     setProgress(bytesUploaded / totalBytes);
      //   },
      //   flush(controller) {
      //     console.log("completed stream");
      //   },
      // });
      const result = await fetch(postUrl, {
        method: "POST",
        // TODO: use the right mime type generally
        headers: { "Content-Type": "audio/mp4" },
        body: blob,
      });
      if (!result.ok) {
        console.log("Failed to upload...");
        console.log("Failed Upload Result:", JSON.stringify(result));
        setProgress("Failed to upload");
        return;
      }
      setProgress("Setting file metadata");
      const { storageId } = await result.json();
      const uploadResult = await saveRecording({ storageId, author: user.id });
      setProgress("Upload complete");
      // TODO: do something to the UI to show that the upload is complete
      // console.log(uploadResult);
    } catch (err) {
      console.error("Fetch error", err);
      throw err;
    }
  }

  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        mode="contained"
        onPress={async () => {
          await uploadAndSaveRecording();
        }}
      >
        UploadFile
      </Button>
      <Text>Progress: {progress}</Text>
    </View>
  );
}
