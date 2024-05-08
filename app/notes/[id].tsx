import { View, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import React from "react";
import { Audio } from "expo-av";

export default function SingleNote() {
  const { id } = useLocalSearchParams();
  const recId = id as Id<"recordings">;
  const note = useQuery(api.notes.getNote, { recId });
  const noteAudio = useQuery(api.notes.getNoteAudio, { recId });

  // const [sound, setSound] = React.useState<Audio.Sound>();

  // async function playSound() {
  //   console.log("Loading Sound");
  //   const { sound } = await Audio.Sound.createAsync({ uri: note?.recording });
  //   setSound(sound);

  //   console.log("Playing Sound");
  //   await sound.playAsync();
  // }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Note",
        }}
      />
      <AudioPlayer uri={noteAudio?.audio} />
      <Text>{note?.text}</Text>
    </View>
  );
}

function AudioPlayer({ uri }: { uri: string }) {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [playing, setPlaying] = React.useState(false);

  async function playSound() {
    console.log("Loading Sound");
    // Unload the old sound if it exists
    if (sound) {
      console.log("Unloading old sound if loaded Sound");
      await sound.unloadAsync(); // fire and forget
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);

    console.log("Playing Sound");
    try {
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound", error);
    }

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        console.log("Sound finished playing");
        setPlaying(false);
      }
    });

    setPlaying(true);
  }

  async function stopSound() {
    console.log("Pausing Sound");
    await sound?.stopAsync();
    setPlaying(false);
  }

  // Make sure to unload the sound when the component unmounts
  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View>
      {playing && (
        <Button mode="contained" onPress={stopSound}>
          Stop
        </Button>
      )}
      {!playing && (
        <Button mode="contained" onPress={playSound}>
          Play
        </Button>
      )}
    </View>
  );
}
