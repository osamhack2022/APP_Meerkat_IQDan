// core
import { View, BackHandler, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
// comps
import AllClearResponse from './AllClearResponse';
import Unreads from './Unreads';
import ChatroomHeader from '../../components/Chatroom/ChatroomHeader';
// nav
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AllClear,
  AllClearResponseType,
  AllClearTabParamList,
  RootStackParamList,
  User,
} from '../../common/types.d';
import { StackScreenProps } from '@react-navigation/stack';
// assets
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../../common/api';
import { isEmpty } from '../../common/isEmpty';

type AllClearStatisticsTabProps = StackScreenProps<
  RootStackParamList,
  'AllClearStatisticsTab'
>;

export default function AllClearStatisticsTab(
  props: AllClearStatisticsTabProps,
) {
  const Tab = createBottomTabNavigator<AllClearTabParamList>();
  const { navigation } = props;
  const { chatroomId, messageId } = props.route.params;

  // state data
  const [isFault, setIsFault] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false); // error occur then true

  // data from server
  const [clears, setClears] = useState<AllClear[]>([]);
  const [problems, setProblems] = useState<AllClear[]>([]);
  const [unreads, setUnreads] = useState<User[]>([]);

  // fetch data
  useEffect(() => {
    if (isEmpty(chatroomId) || isEmpty(messageId)) {
      setIsFault(true);
      return;
    }

    const getData = async () => {
      try {
        const allClearsResponse = await api.get(
          `/allclear/response/all/${messageId}`,
        );
        const unreadsResponse = await api.post('/messages/unread', {
          chatroomId: chatroomId,
          messageId: messageId,
        });

        const clearResponses = allClearsResponse.data.data.map(
          (elem: AllClear) => {
            if (elem.type === AllClearResponseType.CLEAR) {
              return elem;
            }
          },
        );
        const problemResponses = allClearsResponse.data.data.map(
          (elem: AllClear) => {
            if (elem.type === AllClearResponseType.PROBLEM) {
              return elem;
            }
          },
        );

        setClears(clearResponses);
        setProblems(problemResponses);
        setUnreads(unreadsResponse.data.data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // hardware back press action
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Chat', { chatroomId: chatroomId });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <View style={{ width: '100%', height: '100%' }}>
        <ChatroomHeader
          onPressBack={() =>
            navigation.navigate('Chat', { chatroomId: chatroomId })
          }
          name={'이상 무 응답 통계'}
        />
        <Tab.Navigator screenOptions={{ tabBarStyle: { height: 50 } }}>
          <Tab.Screen
            name="AllClears"
            children={() => (
              <AllClearResponse
                isLoading={isLoading}
                isFault={isFault}
                isError={isError}
                list={clears}
                categoryName={'이상 무 보고 상세'}
              />
            )}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <FontAwesome5
                  name="user-check"
                  size={24}
                  color={focused ? '#6A4035' : '#E5B47F'}
                />
              ),
              tabBarLabelStyle: {
                fontSize: 0,
              },
            }}
          />
          <Tab.Screen
            name="Problems"
            children={() => (
              <AllClearResponse
                isLoading={isLoading}
                isFault={isFault}
                isError={isError}
                list={problems}
                categoryName={'특이사항 보고 상세'}
              />
            )}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <MaterialIcons
                  name="report-problem"
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
            name="Unreads"
            children={() => (
              <Unreads
                isLoading={isLoading}
                isFault={isFault}
                isError={isError}
                list={unreads}
                categoryName={'읽지 않은 전우들'}
              />
            )}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Entypo
                  name="eye-with-line"
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
    </>
  );
}
