// core
import { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
// comps
import ChatroomPage from "./pages/ChatroomPage";
import Auth from "./pages/Auth";
import { LoginContext, SocketContext } from "./common/Context";
// hooks
import useLoginCheck from "./hooks/useLoginCheck";
// nav
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./common/types";
import { createStackNavigator } from "@react-navigation/stack";
import Main from "./pages/Main";
import MyProfile from "./pages/SettingsPages/MyProfile";
import ChangePw from "./pages/SettingsPages/ChangePw";
import AddChatroom from "./pages/ChatroomList/AddChatroom";
import AddFriend from "./pages/AddFriend";
import UnreadPeoples from "./pages/UnreadPeoples";
import { useSocketIO } from "./hooks/useSocketIO";
import { globalSocketFunction } from "./common/globalSocket";
import AllClearStatistics from "./pages/AllClearStatistics";
import MyAllClearReport from "./pages/MyAllClearReport";
import ReportAllClear from "./pages/ReportAllClear";


// nav
const Stack = createStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>() // need to use composite list for tab usage

// keep the splash screen
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        "noto-bold": require("./assets/fonts/NotoSansKR-Bold.otf"),
        "noto-med": require("./assets/fonts/NotoSansKR-Medium.otf"),
        "noto-reg": require("./assets/fonts/NotoSansKR-Regular.otf"),
    });

    // login token hook
    const { checkIfLoggedIn, isLoginLoading, isNotLoggedIn, userId } =
        useLoginCheck();

    // splash hide callback
    const hideSplash = useCallback(async () => {
        if (!isLoginLoading && fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [isLoginLoading, fontsLoaded]);

    useEffect(() => {
        if (isNotLoggedIn && navigationRef.isReady()) {
            navigationRef.navigate("Auth"); // if not logged in, send user to login screen
    }
    }, [navigationRef.current])
    // socket
    const {socket} = useSocketIO(isNotLoggedIn, globalSocketFunction);


    if (isLoginLoading || !fontsLoaded) return null;
    return (
      <NavigationContainer
        ref={navigationRef}
        onReady={hideSplash}
        theme={{
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, background: 'white' },
        }}
      >
        <LoginContext.Provider
          value={{
            userId: userId,
            checkIfLoggedIn: checkIfLoggedIn,
            isNotLoggedIn: isNotLoggedIn,
          }}
        >
          <SocketContext.Provider value={{ socket: socket }}>
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
                component={ChatroomPage}
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
              <Stack.Screen
                name="AddChatroom"
                component={AddChatroom}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddFriend"
                component={AddFriend}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="UnreadPeoples"
                component={UnreadPeoples}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AllClearStatistics"
                component={AllClearStatistics}
                options={{ headerShown: false }}
              />              
              <Stack.Screen
                name="MyAllClearReport"
                component={MyAllClearReport}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ReportAllClear"
                component={ReportAllClear}
                options={{ headerShown: false }}
              />
              
            </Stack.Navigator>
          </SocketContext.Provider>
        </LoginContext.Provider>
      </NavigationContainer>
    );
}
