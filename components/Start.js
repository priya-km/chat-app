import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import { getAuth, signInAnonymously } from "firebase/auth"; // initialize firebase auth handler

const image = require("../img/background.png");

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const auth = getAuth();
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [keyboardShown, setKeyboardShown] = useState(false);

  const signInUser = () => {
    // sign in user anonymously
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("Chat", {
          userID: result.user.uid,
          name: name,
          color: color,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in. Please try later.");
      });
  };

  const handleTextInputFocus = () => {
    /* Change text input to black 100% opacity when the user presses/starts typing */
    setIsTextInputFocused(true);
  };

  const handleTextInputBlur = () => {
    /* When the text input is not focused, the color of your name text is purple and 50% opacity */
    setIsTextInputFocused(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardShown(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardShown(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {/* Rendered text using the <Text> component */}
          <Text style={styles.chatApp}>Chat App</Text>
        </View>
        <KeyboardAvoidingView
          style={[
            styles.inputButtonContainer,
            { height: keyboardShown ? "60%" : "40%" },
          ]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.subContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  /* Changing text opacity if the user starts typing in the input box */
                  opacity: isTextInputFocused ? 1 : 0.5,
                  /* Changing text color to black if the user starts typing */
                  color: isTextInputFocused ? "black" : "#757083",
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              onFocus={handleTextInputFocus}
              onBlur={handleTextInputBlur}
            />

            {/* BG COLOR SELECTION */}
            <Text style={styles.bgColor}>Choose Background Color:</Text>
            <View style={styles.colorButtonContainer}>
              <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: "#090C08" }]}
                onPress={() => setColor("#090C08")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: "#474056" }]}
                onPress={() => setColor("#474056")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: "#8A95A5" }]}
                onPress={() => setColor("#8A95A5")}
              ></TouchableOpacity>
              <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: "#B9C6AE" }]}
                onPress={() => setColor("#B9C6AE")}
              ></TouchableOpacity>
            </View>
            <View style={styles.chatButtonContainer}>
              <TouchableOpacity
                style={styles.fauxButton__text}
                title="Start Chatting"
                onPress={signInUser}
              >
                <Text style={styles.fauxButton__text}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "88%",
  },
  bgColor: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
  },
  colorButtonContainer: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
  },
  colorButton: {
    backgroundColor: "black",
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  image: {
    flex: 1,
  },
  inputButtonContainer: {
    width: "80%",
    height: "60%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white" /* Background color of the white box */,
    marginTop: "8%",
    marginBottom: "10%",
  },
  textInput: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: "50%",
  },
  chatButtonContainer: {
    width: "100%",
    alignItems: "center",
  },
  chatApp: {
    fontSize: 45,
    fontWeight: "600",
    color: "#ffffff",
  },
  colorSelect__text: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    opacity: 100,
  },
  fauxButton__text: {
    color: "black",
    fontWeight: "600",
  },
});

export default Start;
