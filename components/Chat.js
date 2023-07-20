import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []); // empty array as second parameter to not rely on any state changes of the component
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text
        style={[
          styles.helloText,
          {
            color:
              color === "#090C08" || color === "#474056" ? "white" : "black", // If the first 2 background colors are chosen, the Hello text color will be white, otherwise it will be black
          },
        ]}
      >
        Hello!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  helloText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Chat;
