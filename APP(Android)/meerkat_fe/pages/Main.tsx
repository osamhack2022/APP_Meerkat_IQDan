// comps
import Friend from './FriendList';
import ChatRoomList from './ChatRoomList/ChatRoomList';
import Settings from './Settings';
// nav
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../common/types';
// assets
import { Ionicons, Entypo } from '@expo/vector-icons';
// hooks
import { useSocketIO } from '../hooks/useSocketIO';
// context
import { SocketContext } from '../common/Context';

export default function Main() {
  const Tab = createBottomTabNavigator<TabParamList>();

  const {socket, isSocketConnected } = useSocketIO();
  // socketio using example are below: emit socketio event only connected.
  // call SocketContext in Component below 'Main'.
  // const {socket, isSocketConnected} = useContext(SocketContext);
  // if(isSocketConnected){
  //   socket.timeout(5000).emit(EVENT_NAME, EVENT_BODY);
  //   socket.timeout(5000).emit(EVENT_NAME, EVENT_BODY);
  // }  
  

  return (
    <SocketContext.Provider
      value={{socket: socket, isSocketConnected: isSocketConnected}}
    >
      <Tab.Navigator screenOptions={{ tabBarStyle: { height: 50 } }}>
        <Tab.Screen
          name="Friends"
          component={Friend}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="people"
                size={30}
                color={focused ? '#6A4035' : '#E5B47F'}
              />
            ),
            tabBarLabelStyle: {
              fontSize: 0,
            },
          }}
        />
        <Tab.Screen
          name="ChatRoomList"
          component={ChatRoomList}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Entypo
                name="chat"
                size={30}
                color={focused ? '#6A4035' : '#E5B47F'}
              />
            ),
            tabBarLabelStyle: {
              fontSize: 0,
            },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="settings-sharp"
                size={30}
                color={focused ? '#6A4035' : '#E5B47F'}
              />
            ),
            tabBarLabelStyle: {
              fontSize: 0,
            },
          }}
        />
      </Tab.Navigator>
    </SocketContext.Provider>
  );
}
