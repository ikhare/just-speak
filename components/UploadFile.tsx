import { Button } from "react-native-paper";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import React from "react";
import { View, Text } from "react-native";

export default function UploadFile({ uri }: { uri: string }) {
  const generateUploadUrl = useMutation(api.fileUpload.generateUploadUrl);
  const sendFile = useMutation(api.fileUpload.sendFile);
  const { user } = useUser();
  const [progress, setProgress] = React.useState(0);

  async function sendFileToServer() {
    const postUrl = await generateUploadUrl();
    console.log("PostUrl:", postUrl);

    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `audio/${match[1]}` : `audio`;

    console.log("Uri:", uri);
    const fileData = await fetch(uri);
    // console.log("FileData:", fileData);
    if (!fileData.ok) {
      console.log("error loading file", fileData);
    }
    const blob = await fileData.blob();
    // console.log("Blob:", blob);

    // let formData = new FormData();
    // formData.append("file", blob);

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
        headers: { "Content-Type": "audio/mp4" },
        body: blob,
      });
      // console.log("Tried to upload...");
      if (!result.ok) {
        console.log("Failed to upload...");
        console.log("Failed Upload Result:", JSON.stringify(result));
        return;
      }
      // console.log("Uploaded...");
      // console.log("Upload Result:", JSON.stringify(result));
      const { storageId } = await result.json();
      console.log("Storage Id:", storageId.toString());
      const uploadResult = await sendFile({ storageId, author: user.id });
      console.log(uploadResult);
    } catch (err) {
      console.error("Fetch error", err);
      // throw err;
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
          await sendFileToServer();
        }}
      >
        UploadFile
      </Button>
      <Text>Progress: {progress * 100}%</Text>
    </View>
  );
}
