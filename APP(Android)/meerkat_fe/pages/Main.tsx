import { View, Text, Alert, ActivityIndicator, DeviceEventEmitter } from 'react-native';
// comps
import Friend from './FriendList';
import ChatroomList from './ChatroomList/ChatroomList';
import Settings from './Settings';
// nav
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../common/types';
// assets
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import api from '../common/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sleep } from '../common/etc';
import { generateRSAKeys } from '../common/crypto';

const LoadingComponent = () => {
  return (
    <View
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(80, 80, 80, 0.8)',
        zIndex: 100,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" />
      <View style={{ width: '80%', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24, fontFamily:"noto-med"}}>
          보안키를 생성중입니다.
        </Text>
      </View>
    </View>
  );
};

export default function Main() {
  const Tab = createBottomTabNavigator<TabParamList>();
  const [loading, setLoading] = useState(false);

  const checkPublicKey = async () => {
    try {
      let me = (await api.get('/users/me')).data.data;
      let key = (await api.get('/users/publicKey/' + me.userId)).data.data.key;

      if (!key) {
        setLoading(true);
        await sleep(0.1);

        let keys = generateRSAKeys();
        let res = await api.post('/users/publicKey', {
          publicKey: keys.getPublicKey(),
        });

        await AsyncStorage.setItem('PublicKey', keys.getPublicKey());
        await AsyncStorage.setItem('PrivateKey', keys.getPrivateKey());
      }
    } catch (e) {
      Alert.alert(
        '보안키 생성 실패',
        '서버에 공개키를 업로드 하지 못했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPublicKey();
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener("loading_started", () => setLoading(true));
    DeviceEventEmitter.addListener("loading_ended", () => setLoading(false));
  })

  return (
    <View style={{ width: '100%', height: '100%' }}>
      {loading && <LoadingComponent />}
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
          name="ChatroomList"
          component={ChatroomList}
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
    </View>
  );
}
