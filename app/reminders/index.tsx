import { View, FlatList } from "react-native";
import { Link, Stack } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { List, Text } from "react-native-paper";

export default function RemindersList() {
  const reminders = useQuery(api.reminders.getReminders);

  return (
    <View style={{}}>
      <Stack.Screen
        options={{
          title: "Reminders",
        }}
      />
      <FlatList
        data={reminders}
        renderItem={({ item: reminder }) => (
          // <Link href={`/reminders/${reminder._id}`}>
          <List.Item
            title={
              <Text variant="titleMedium">
                {`${new Date(reminder._creationTime).toLocaleString()} - ${reminder.text}`}
              </Text>
            }
          />
          // </Link>
        )}
      />
    </View>
  );
}
