import { View } from "react-native";
import { Checkbox, Text, useTheme } from "react-native-paper";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import React from "react";

export default function SingleTodoList() {
  const { id } = useLocalSearchParams();
  const listId = id as Id<"todoLists">;
  const list = useQuery(api.todoLists.getTodoList, { listId });
  const theme = useTheme();

  console.log("entry", list);

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Stack.Screen
        options={{
          title: "Todo List",
        }}
      />
      {list && (
        <>
          <View style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Text variant="displayMedium">{list.title}</Text>
            <Text variant="labelMedium">
              {new Date(list._creationTime).toLocaleString()}
            </Text>
            {list.description && (
              <View
                style={{
                  backgroundColor: theme.colors.secondaryContainer,
                  padding: 2,
                }}
              >
                <Text variant="labelMedium">Description</Text>
                <Text variant="bodyLarge">{list.description}</Text>
              </View>
            )}

            <TodoList list={list.list}></TodoList>
          </View>
        </>
      )}
    </View>
  );
}

function TodoList({ list }: { list: Array<string> }) {
  return list.map((item, index) => (
    <View style={{ flexDirection: "row", alignItems: "center" }} key={index}>
      <Todo item={item}></Todo>
    </View>
  ));
}

function Todo({ item }: { item: string }) {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <Checkbox
        status={checked ? "checked" : "unchecked"}
        onPress={() => {
          setChecked(!checked);
        }}
      />
      <Text variant="titleMedium">{item}</Text>
    </>
  );
}
