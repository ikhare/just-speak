import { View, Text } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

// TODO: Add a list of notes here.
export default function NotesList() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Notes list",
        }}
      />
    </View>
  );
}
