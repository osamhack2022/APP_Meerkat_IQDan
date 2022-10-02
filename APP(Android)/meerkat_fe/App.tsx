// core
import { createContext} from "react";
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

export const LoginContext = createContext({
    refreshLoginToken: () => {},
});

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

    // // login token hook
    const { refreshLoginToken, isLoginLoading, isNotLoggedIn } = useLoginCheck();

    // // rendering part
    if (isLoginLoading || !fontsLoaded) return null; // prevent removing splash screen
    SplashScreen.hideAsync(); // remove splash screen
    if (isNotLoggedIn) {
        return <Auth refreshLoginToken={refreshLoginToken} />;
    }
    return (
        <NavigationContainer>
            <LoginContext.Provider
                value={{ refreshLoginToken: refreshLoginToken }}
            >
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
                        name="Friend"
                        component={Friend}
                        options={{ headerShown: false }}
                    />
                </Stack.Navigator>
            </LoginContext.Provider>
        </NavigationContainer>
    );
}
