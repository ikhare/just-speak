import { Link, Stack, useNavigation, useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { Appbar, Button, Divider, Menu } from "react-native-paper";
import { Audio } from "expo-av";
import { RecordingStatus } from "expo-av/build/Audio";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "../convex/_generated/api";
import SignUpScreen from "../components/SignUpScreen";
import SignInScreen from "../components/SignInScreen";
import UploadFile from "../components/UploadFile";

// function LogoTitle() {
//   return (
//     <Image
//       style={{ width: 50, height: 50 }}
//       source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
//     />
//   );
// }

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {/* {user !== undefined ? (
        <>Loading....</>
      ) : user === null ? (
        <SignUpSignIn signIn={signIn} signUp={signUp} />
      ) : (
        <>
          <>Signed in with email: {user.email}</>
          <SignOutButton />
          <RecordingScreen />
        </>
      )} */}
      <SignedIn>
        <MainScreenWrapper>
          <RecordingScreen />
        </MainScreenWrapper>
      </SignedIn>
      <SignedOut>
        <SignInScreen />
        <Text>or</Text>
        <SignUpScreen />
      </SignedOut>
    </View>
  );
}

function MainScreenWrapper({ children }) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const { isLoaded, signOut } = useAuth();
  const { user } = useUser();

  return (
    <>
      <Stack.Screen
        options={{
          // https://reactnavigation.org/docs/headers#setting-the-header-title
          title: "Record it!",
          // https://reactnavigation.org/docs/headers#adjusting-header-styles
          // headerStyle: { backgroundColor: "#f4511e" },
          // headerTintColor: "#fff",
          // headerTitleStyle: {
          //   fontWeight: "bold",
          // },
          // https://reactnavigation.org/docs/headers#replacing-the-title-with-a-custom-component
          // headerTitle: (props) => <LogoTitle />, // {...props}
          headerRight: () => (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
            >
              <Menu.Item
                onPress={() => {
                  signOut();
                  closeMenu();
                }}
                title={
                  <Text>Sign Out {user.emailAddresses[0].toString()}</Text>
                }
              />
              <Menu.Item onPress={() => {}} title="Item 2" />
              <Divider />
              <Menu.Item onPress={() => {}} title="Item 3" />
            </Menu>
          ),
        }}
      />
      {children}
    </>
  );
}

function RecordingScreen() {
  const router = useRouter();

  const [recording, setRecording] = React.useState<Audio.Recording>();
  const [soundUri, setSoundUri] = React.useState<string>();
  const [metering, setMetering] = React.useState<number>(0.5);

  function normalizeMetering(metering: number) {
    return (metering + 160) / 160;
  }

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status: RecordingStatus) => {
          console.log("Recording status", status.metering);
          if (status.metering) {
            setMetering(normalizeMetering(status.metering));
          }
        },
        50
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    setSoundUri(uri);
    console.log("Recording stopped and stored at", uri);
  }

  const [sound, setSound] = React.useState<Audio.Sound>();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <>
      <Text>Home Screen</Text>
      <Button
        mode="contained"
        onPress={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </Button>

      <View
        style={{
          width: 200,
          height: 200,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 200 * Math.max(metering, 0.3),
            height: 200 * Math.max(metering, 0.3),
            backgroundColor: "red",
            borderRadius: 100,
          }}
        />
      </View>

      <Button mode="contained" onPress={playSound}>
        Play Sound
      </Button>

      {soundUri !== undefined && <UploadFile uri={soundUri} />}

      <Link href="/notes/">
        <Button mode="contained-tonal">Go to Details</Button>
      </Link>
    </>
  );
}
