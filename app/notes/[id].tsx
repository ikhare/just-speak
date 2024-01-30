import { View, Text, FlatList } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { List } from "react-native-paper";
import { Id } from "../../convex/_generated/dataModel";

export default function SingleNote() {
  const { id } = useLocalSearchParams();
  const fileId = id as Id<"files">;
  const note = useQuery(api.notes.getNote, id !== null ? { fileId } : "skip");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Note",
        }}
      />
      <Text>{note?.text}</Text>
    </View>
  );
}
