// comps
import Friend from "./FriendList";
import ChatRoomList from "./ChatRoomList";
import Settings from "./Settings";
// nav
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../common/types";
// assets
import { Ionicons, Entypo } from "@expo/vector-icons";

export default function Main() {
    const Tab = createBottomTabNavigator<TabParamList>();

    return (
        <Tab.Navigator screenOptions={{tabBarStyle: {height: 50}}}>
            <Tab.Screen
                name="Friends"
                component={Friend}
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <Ionicons name="people" size={30} color={focused ? "#6A4035" : "#E5B47F"} />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 0
                    }
                }}
            />
            <Tab.Screen
                name="ChatRoomList"
                component={ChatRoomList}
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <Entypo name="chat" size={30} color={focused ? "#6A4035" : "#E5B47F"} />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 0
                    }
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <Ionicons
                            name="settings-sharp"
                            size={30}
                            color={focused ? "#6A4035" : "#E5B47F"}
                        />
                    ),
                    tabBarLabelStyle: {
                        fontSize: 0
                    }
                }}
            />
        </Tab.Navigator>
    );
}
