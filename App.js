import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";
import { LogBox } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { Alert } from "react-native";
import { getStorage } from "firebase/storage";

// create navigator
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const App = () => {
  const connectionStatus = useNetInfo();

  const firebaseConfig = {
    apiKey: "AIzaSyBrixL1e_E8LtRN6yupS-5XkGAnkFJ_mIY",
    authDomain: "chat-app-eecf1.firebaseapp.com",
    projectId: "chat-app-eecf1",
    storageBucket: "chat-app-eecf1.appspot.com",
    messagingSenderId: "632401402534",
    appId: "1:632401402534:web:0d8d2c5a68e8b102d2f267",
  };

  // initialize firebase
  const app = initializeApp(firebaseConfig);
  // initialize cloud firestore
  const db = getFirestore(app);
  const storage = getStorage(app);

  // see if the user has an online connection, if not display an alert message
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  // render screens and check connection
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
