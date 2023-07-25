import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Chat = ({ db, route, navigation }) => {
  const { name, color, userID } = route.params;
  const [messages, setMessages] = useState([]); // set messages state

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerStyle: {
        backgroundColor:
          color /* set background color for header based on users choice on start screen */,
      },
      headerTitleStyle: {
        color: color === "" ? "#000" : "#fff", // text color on header to use white if bg color is black
      },
    });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
      documentsSnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });

    // Clean up func
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, []);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userID, name }}
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
  return (
    <Bubble
      {...props}
      /* Changing message bubble colors: right is the sender, left is received messages */
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
