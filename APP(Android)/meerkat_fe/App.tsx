// core
import { View } from "react-native";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// comps
import ChatRoomList from "./pages/ChatRoomList";
import ChatRoom from "./pages/ChatRoom";
import APIExample from "./pages/APIExample";
import Friend from "./pages/FriendList";
import Auth from "./pages/Auth";
import { LoginContext } from "./common/Context";
// hooks
import useLoginCheck from "./hooks/useLoginCheck";
// nav
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
    Auth: undefined;
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
    const [fontsLoaded] = useFonts({
        "noto-black": require("./assets/fonts/NotoSansKR-Black.otf"),
        "noto-bold": require("./assets/fonts/NotoSansKR-Bold.otf"),
        "noto-light": require("./assets/fonts/NotoSansKR-Light.otf"),
        "noto-med": require("./assets/fonts/NotoSansKR-Medium.otf"),
        "noto-reg": require("./assets/fonts/NotoSansKR-Regular.otf"),
        "noto-thin": require("./assets/fonts/NotoSansKR-Thin.otf"),
    });

    // login token hook
    const { refreshLoginToken, isLoginLoading, isNotLoggedIn } =
        useLoginCheck();

    // splash hide callback
    const hideSplash = useCallback(async () => {
        if (!isLoginLoading && fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [isLoginLoading, fontsLoaded]);

    if (isLoginLoading || !fontsLoaded) return null;
    return (
        <NavigationContainer onReady={hideSplash}>
            <LoginContext.Provider
                value={{
                    refreshLoginToken: refreshLoginToken,
                    isNotLoggedIn: isNotLoggedIn,
                }}
            >
                <Stack.Navigator initialRouteName="Auth">
                    <Stack.Screen
                        name="Auth"
                        component={Auth}
                        options={{ headerShown: false }}
                    />
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
                        name="Friend"
                        component={Friend}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </LoginContext.Provider>
        </NavigationContainer>
    );
}
