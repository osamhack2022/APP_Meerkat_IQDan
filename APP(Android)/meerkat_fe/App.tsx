// core
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// comps
import ChatRoomList from "./pages/ChatRoomList";
import ChatRoom from "./pages/ChatRoom";
import APIExample from "./pages/APIExample";
import Friend from "./pages/FriendList";
import Auth from "./components/Auth";
// hooks
import useLoginCheck from "./hooks/useLoginCheck";
// nav
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Chat: undefined;
  Test: undefined;
  Friend: undefined;
};

// nav
const Stack = createNativeStackNavigator<RootStackParamList>();
// keep the splash screen
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [fontsLoaded] = useFonts({
        "noto-black": require("./assets/fonts/NotoSansKR-Black.otf"),
        "noto-bold": require("./assets/fonts/NotoSansKR-Bold.otf"),
        "noto-light": require("./assets/fonts/NotoSansKR-Light.otf"),
        "noto-med": require("./assets/fonts/NotoSansKR-Medium.otf"),
        "noto-reg": require("./assets/fonts/NotoSansKR-Regular.otf"),
        "noto-thin": require("./assets/fonts/NotoSansKR-Thin.otf"),
    });
    const [tokenRefresherFlag, setTokenRefresherFlag] =
        useState<boolean>(false);

    const loginToken = useLoginCheck(tokenRefresherFlag);

    // refreshed login token to get new data from asyncstorage
    const refreshLoginToken = () => {
        setTokenRefresherFlag(!tokenRefresherFlag);
    };

    // loading useEffect
    useEffect(() => {
        if (loginToken !== null && fontsLoaded) {
            setIsLoading(false);
        }
    }, [loginToken, fontsLoaded]);

    // rendering part
    if (isLoading) return null; // prevent removing splash screen
    SplashScreen.hideAsync(); // remove splash screen
    // if (loginToken == "") {
    //     return <Auth refreshLoginToken={refreshLoginToken} />;
    // }
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={ChatRoomList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Chat"
                    component={ChatRoom}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Test"
                    component={APIExample}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='Friend'
                    component={Friend}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
