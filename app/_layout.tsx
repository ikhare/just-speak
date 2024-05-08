import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import "react-native-get-random-values";
import { CONVEX_URL, CLERK_PUBLISHABLE_KEY } from "@env";
import { Stack } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

// For Clerk auth caching
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF9F1C",
    primaryContainer: "#FFBF69",
    secondary: "#2EC4B6",
    secondaryContainer: "#CBF3F0",
    background: "#FFFFFF",
    surface: "#e9c46a",
  },
};

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function Layout() {
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <PaperProvider theme={theme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.background,
              },
              headerTintColor: theme.colors.onBackground,
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </PaperProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
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
