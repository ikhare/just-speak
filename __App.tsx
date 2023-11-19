import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "react-native-get-random-values";
import { CONVEX_URL } from "@env";
import { Button } from "react-native-paper";

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button mode="contained">Sign Up</Button>
        <StatusBar style="auto" />
      </View>
    </ConvexProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
