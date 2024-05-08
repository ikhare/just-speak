import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import React from "react";
import { Audio } from "expo-av";

// NOTE THIS IS NOT USED
export default function SingleJournalEntry() {
  const { id } = useLocalSearchParams();
  const entryId = id as Id<"journal">;
  const entry = useQuery(api.journal.getJournalEntry, { entryId });
  const theme = useTheme();

  console.log("entry", entry);

  // const [sound, setSound] = React.useState<Audio.Sound>();

  // async function playSound() {
  //   console.log("Loading Sound");
  //   const { sound } = await Audio.Sound.createAsync({ uri: note?.recording });
  //   setSound(sound);

  //   console.log("Playing Sound");
  //   await sound.playAsync();
  // }

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          title: "Journal Entry",
        }}
      />
      {entry && (
        <>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Text variant="displayMedium">{entry.title}</Text>
            <Text variant="labelMedium">
              {new Date(entry._creationTime).toLocaleString()}
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                padding: 2,
              }}
            >
              <Text variant="labelMedium">Tweet</Text>
              <Text variant="bodyLarge">{entry.tweet}</Text>
            </View>

            <Text variant="bodyMedium">{entry.body}</Text>
          </View>
        </>
      )}
    </View>
  );
}
