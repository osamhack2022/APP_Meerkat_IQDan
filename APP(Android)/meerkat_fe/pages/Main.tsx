import Friend from "./FriendList";
import ChatRoomList from "./ChatRoomList";
import Settings from "./Settings";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../common/types";

export default function Main() {
    const Tab = createBottomTabNavigator<TabParamList>();

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Friends"
                component={Friend}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="ChatRoomList"
                component={ChatRoomList}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    );
}
``;
