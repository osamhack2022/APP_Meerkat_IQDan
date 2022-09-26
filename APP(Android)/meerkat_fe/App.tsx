import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import ChatRoomList from "./pages/ChatRoomList";
import ChatRoom from './pages/ChatRoom';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    "noto-black": require("./assets/fonts/NotoSansKR-Black.otf"),
    "noto-bold": require("./assets/fonts/NotoSansKR-Bold.otf"),
    "noto-light": require("./assets/fonts/NotoSansKR-Light.otf"),
    "noto-med": require("./assets/fonts/NotoSansKR-Medium.otf"),
    "noto-reg": require("./assets/fonts/NotoSansKR-Regular.otf"),
    "noto-thin": require("./assets/fonts/NotoSansKR-Thin.otf"),
  });

  useEffect(() => {
    // sync all data from server
  }, [])

  return (
    <NavigationContainer>
      {fontsLoaded && <Stack.Navigator
        initialRouteName='Home'
      >
        <Stack.Screen
          name='Home'
          component={ChatRoomList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Chat'
          component={ChatRoom}
        />
      </Stack.Navigator>}
    </NavigationContainer>
  )
}