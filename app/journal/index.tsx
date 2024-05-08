import { View, FlatList } from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { List, Text } from "react-native-paper";

export default function NotesList() {
  const entries = useQuery(api.journal.getJournalEntries);

  return (
    <View style={{}}>
      <Stack.Screen
        options={{
          title: "Notes list",
        }}
      />
      <FlatList
        data={entries}
        renderItem={({ item: entry }) => (
          <Link href={`/journal/${entry._id}`}>
            <List.Item
              title={
                <Text variant="titleLarge">
                  {entry.title
                    ? entry.title
                    : `Note on ${new Date(entry._creationTime).toLocaleString()}`}
                </Text>
              }
            />
          </Link>
        )}
      />
    </View>
  );
}
