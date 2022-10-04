// core
import { View } from "react-native";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// comps

import ChatRoom from "./pages/ChatRoom";
import Auth from "./pages/Auth";
import { LoginContext } from "./common/Context";
// hooks
import useLoginCheck from "./hooks/useLoginCheck";
// nav
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { RootStackParamList } from "./common/types";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./pages/Main";
import MyProfile from "./pages/settingsPages/MyProfile";
import ChangePw from "./pages/settingsPages/ChangePw";

// nav
const Stack = createStackNavigator<RootStackParamList>();

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
        <NavigationContainer
            onReady={hideSplash}
            theme={{
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors, background: "white" },
            }}
        >
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
                        name="Main"
                        component={Main}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={ChatRoom}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="MyProfile"
                        component={MyProfile}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ChangePw"
                        component={ChangePw}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </LoginContext.Provider>
        </NavigationContainer>
    );
}
