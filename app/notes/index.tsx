import { View, Text, FlatList } from "react-native";
import { Link, Stack } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { List } from "react-native-paper";

export default function NotesList() {
  const notes = useQuery(api.notes.getNotes);

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
          <Link href={`/notes/${note.recId}`}>
            <List.Item
              title={
                note.label
                  ? note.label
                  : `Note on ${new Date(note.creationTime).toLocaleString()}`
              }
            />
          </Link>
        )}
      />
    </View>
  );
}
