import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const image = require("../img/background.png");

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true); // Change textinput to black 100% opacity when the user presses/starts typing
  };

  const handleTextInputBlur = () => {
    // When the text input is not focused, the color of your name text is purple and 50% opacity
    setIsTextInputFocused(false);
  };

  return (
    <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.chatApp}>Chat App</Text>
        </View>
        <View style={styles.inputButtonContainer}>
          <View style={styles.subContainer}>
            <TextInput
              style={[
                styles.textInput,
                {
                  opacity: isTextInputFocused ? 1 : 0.5, // changing text opacity if the user starts typing in input box
                  color: isTextInputFocused ? "black" : "#757083", // changing text color to black if the user starts typing
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Your Name"
              onFocus={handleTextInputFocus}
              onBlur={handleTextInputBlur}
            />
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
              <Button
                color="#757083"
                title="Start Chatting"
                onPress={() =>
                  navigation.navigate("Chat", {
                    name: name,
                    color: color,
                  })
                }
              />
            </View>
          </View>
        </View>
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
    fontWeight: 300,
    fontColor: "#757083",
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
    height: "30%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white", // Background color of the white box
    marginTop: "8%",
    marginBottom: "15%",
  },
  textInput: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 300,
    color: "#757083",
    opacity: "50%",
    borderColor: "757083",
  },
  chatButtonContainer: {
    width: "100%",
    height: "fixed",
    alignItems: "center",
  },
  chatApp: {
    fontSize: 45,
    fontWeight: 600,
    color: "#ffffff",
  },
});

export default Start;
