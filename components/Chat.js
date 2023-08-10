import { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import CustomActions from "./CustomActions";
import MapView from "react-native-maps";

const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const { name, color, userID } = route.params;
  const [messages, setMessages] = useState([]); // set messages state

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem("messages")) || "[]";
    setMessages(JSON.parse(cachedMessages));
  };

  let unsubMessages;

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
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      // delete old listener is user goes from offline to online so no memory leaks

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubMessages = onSnapshot(q, (documentsSnapshot) => {
        let newMessages = [];
        documentsSnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()), // convert createdAt to Date object
          });
        });
        cachedMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages();

    // Clean up function
    return () => {
      if (unsubMessages) {
        unsubMessages();
      }
    };
  }, [isConnected]);

  // will delete messages from users async storage when called
  const deleteCachedMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      setMessages([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderInputToolbar = (props) => {
    // renderInputToolbar function, will not render if the user is offline
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
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

  const renderCustomActions = (props) => {
    // renderCustomActions function
    return (
      <CustomActions
        onSend={onSend}
        userID={userID}
        storage={storage}
        {...props}
      />
    );
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{ _id: userID, name }}
      />
      {Platform.OS === "android" ? (
        /* If the user is using an android device, add the height property, if not, they're using ios then do nothing aka null. This is so the keyboard does not cover the text input space on older android devices. */
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {/* Setting a padding prop if the user is on ios so the keyboard doesn't cover anything */}
      {/*      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
