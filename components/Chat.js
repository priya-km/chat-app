import React, { useEffect, useState } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";

const Chat = ({ route, navigation }) => {
  const { name, color } = route.params;

  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: "Hello developer",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: "https://placeimg.com/140/140/any",
      },
    },
    {
      _id: 2,
      text: `${name} has entered the chat`,
      createdAt: new Date(),
      system: true,
    },
  ]);

  const [arrowColor, setArrowColor] = useState(color === "" ? "#000" : "#fff");

  useEffect(() => {
    /* Update arrowColor whenever the color prop changes */
    setArrowColor(color === "" ? "#000" : "#fff");
  }, [color]);

  useEffect(() => {
    /* Set navigation header options */
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor:
          color /* set background color for header based on users choice on start screen */,
      },
      headerTitleStyle: {
        color:
          arrowColor /* Use the updated arrowColor state for the title color */,
      },
    });
  }, [arrowColor]);

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      {/* Set bg color for chat */}
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(newMessages) =>
          setMessages((prevMessages) =>
            GiftedChat.append(prevMessages, newMessages)
          )
        }
        user={{
          _id: 1,
        }}
      />
      {Platform.OS === "android" ? (
        /* If the user is using an android device, add the height property, if not, they're using ios then do nothing aka null. This is so the keyboard does not cover the text input space on older android devices. */
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {/* Setting a padding prop if the user is on ios so the keyboard doesn't cover anything */}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const renderBubble = (props) => {
  /* Changing message bubble colors: right is the sender, left is received messages */
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000",
        },
        left: {
          backgroundColor: "#fff",
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
