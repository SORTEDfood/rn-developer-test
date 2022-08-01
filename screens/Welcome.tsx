import * as React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  ListRenderItemInfo,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  EmailAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import useOrientation from "../hooks/useOrientation";

import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import WelcomeSlide from "../components/WelcomeSlide";

import { spacing } from "../styles";

import { RootStackParamList } from "../types";

// Setup and initialise Firebase
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "sorted-packs.firebaseapp.com",
  databaseURL: "https://sorted-packs.firebaseio.com",
  projectId: "sorted-packs",
  storageBucket: "sorted-packs.appspot.com",
  messagingSenderId: "130479053229",
  appId: "1:130479053229:web:36f74c5ef6237b0390a924",
  measurementId: "G-GQ8VWP74C6",
};

initializeApp(firebaseConfig);

const auth = getAuth();

// Setup routing props for the screen
type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

// Setup welcome slide images
type ItemSlide = {
  key: string;
  title: string;
  text: string;
  image: number | { uri: string };
};

const welcomeImage0 = require("../assets/images/welcome/0.jpg");
const welcomeImage1 = require("../assets/images/welcome/1.jpg");
const welcomeImage2 = require("../assets/images/welcome/2.jpg");
const welcomeImage3 = require("../assets/images/welcome/3.jpg");

const slides: Readonly<ItemSlide[]> = [
  {
    key: "welcome_carousel_0",
    title: "Open Smart Weekly Meal Packs",
    text: "Explore midweek menus and share\ndeliciously fresh recipes for 1, 2, or 4 people in no time.\n\nAll diets welcome! Each menu offers\na diverse selection of meat, fish and\nvegetarian meals.",
    image: welcomeImage0,
  },
  {
    key: "welcome_carousel_1",
    title: "More Taste, Less Waste",
    text: "Every Pack has been developed to utilise all of your fresh groceries each week.\n\nWith clever ingredient crossovers between the Pack's meals you'll use everything you buy!",
    image: welcomeImage1,
  },
  {
    title: "Simplify\nYour Shop,\nSave Money",
    key: "welcome_carousel_2",
    text: "All the packs work off fresh groceries and a selection of store cupboard essentials to minimise your shopping basket. You'll buy only what you need, saving you more money week on week.",
    image: welcomeImage2,
  },
  {
    key: "welcome_carousel_3",
    title: "Cooking Made Simple With Audio Guides and Timers",
    text: "Use friendly audio prompts to learn, create effortless meals and have fun in the kitchen. Tackle the cooking and cleaning in one to get your meals on the table in record time.",
    image: welcomeImage3,
  },
];

const LoginForm: React.FC<{
  isLoading: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
}> = ({ isLoading, onSubmit }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <>
      <View style={styles.formContainer}>
        <Paragraph style={styles.textInputLabel}>Email:</Paragraph>
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Paragraph style={styles.textInputLabel}>Password:</Paragraph>

        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <Button
        disabled={isLoading}
        onPress={() => onSubmit(email, password)}
        style={styles.textInput}
      >
        Sign In
      </Button>
    </>
  );
};

// NOT USED
const SignupForm: React.FC<{
  isLoading: boolean;
  onSubmit: (email: string, password: string, name: string) => Promise<void>;
}> = ({ isLoading, onSubmit }) => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <>
      <View style={styles.formContainer}>
        <Paragraph style={styles.textInputLabel}>Name:</Paragraph>
        <TextInput
          placeholder="name"
          value={name}
          onChangeText={setName}
          style={styles.textInput}
        />
        <Paragraph style={styles.textInputLabel}>Email:</Paragraph>
        <TextInput
          placeholder="email"
          value={email}
          onChangeText={setEmail}
          style={styles.textInput}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Paragraph style={styles.textInputLabel}>Password:</Paragraph>
        <TextInput
          placeholder="password"
          value={password}
          onChangeText={setPassword}
          style={styles.textInput}
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <Button
        disabled={isLoading}
        onPress={() => onSubmit(email, password, name)}
      >
        Sign Up
      </Button>
    </>
  );
};

const WelcomeScreen = ({ navigation }: Props) => {
  const orientation = useOrientation();

  const [isLoading, setIsLoading] = React.useState(false);

  // Listen for authentication state to change.
  onAuthStateChanged(auth, async (user) => {
    if (user != null) {
      console.log("We are authenticated now!");
      const jwtToken = await user.getIdToken();
      // Persist session & make accessible for API calls
      // .......
      console.log("jwtToken", jwtToken);
    }

    // Do other things
  });

  async function authenticateWithFirebase(email: string, password: string) {
    console.log("authenticatedWithFirebase");
    setIsLoading(true);

    const authCredential = EmailAuthProvider.credential(email, password);

    await signInWithCredential(auth, authCredential).catch((error) => {
      // Handle Errors here.
      console.log("error", error);
    });

    setIsLoading(false);
  }

  const renderSlide = (item: ListRenderItemInfo<ItemSlide>) => {
    return (
      <WelcomeSlide
        {...item.item}
        titleStyle={styles.title}
        imageStyle={styles.image}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={renderSlide}
        extraData={orientation}
      />
      <SafeAreaView style={styles.absolute}>
        <LoginForm onSubmit={authenticateWithFirebase} isLoading={isLoading} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    marginTop: 40,
  },
  image: {
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  absolute: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  formContainer: {
    padding: 10,
    backgroundColor: "#eeeeee20",
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    color: "white",
  },
  textInputLabel: {
    color: "white",
  },
  footerTextWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacing.sd,
    marginBottom: spacing.lg,
  },
  footerText: { color: "#fff" },
});

export default WelcomeScreen;
