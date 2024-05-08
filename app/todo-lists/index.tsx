import { View, FlatList } from "react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { List, Text } from "react-native-paper";

export default function TodoLists() {
  const todoLists = useQuery(api.todoLists.getTodoLists);

  return (
    <View style={{}}>
      <Stack.Screen
        options={{
          title: "Notes list",
        }}
      />
      <FlatList
        data={todoLists}
        renderItem={({ item: list }) => (
          <Link href={`/todo-lists/${list._id}`}>
            <List.Item title={<Text variant="titleLarge">{list.title}</Text>} />
          </Link>
        )}
      />
    </View>
  );
}
