import { View, Text, FlatList } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { List } from "react-native-paper";

// TODO: Add a list of notes here.
export default function NotesList() {
  const notes = useQuery(api.notes.getNotes);
  console.log("notes: ", notes);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Notes list",
        }}
      />
      <FlatList
        data={notes}
        renderItem={({ item: note }) => (
          <List.Item title={note.label} onPress={() => alert(note.fileId)} />
        )}
      />
    </View>
  );
}
