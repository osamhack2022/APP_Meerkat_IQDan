// core
import { View, BackHandler, StyleSheet, Text, Pressable } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
// comps
import AllClearResponse from './AllClearResponse';
import Unreads from './Unreads';
import ChatroomHeader from '../../components/Chatroom/ChatroomHeader';
// nav
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
// utils
import api from '../../common/api';
import { isEmpty } from '../../common/isEmpty';
import AngleBracketHeader from '../../components/AngleBracketHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';

type AllClearStatisticsProps = StackScreenProps<
  RootStackParamList,
  'AllClearStatistics'
>;

const unfocusedColor = '#E5B47F';
const focusedColor = '#6A4035';

export default function AllClearStatistics(props: AllClearStatisticsProps) {
  const { navigation } = props;
  const { chatroomId, messageId } = props.route.params;

  // state data
  const [isFault, setIsFault] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false); // error occur then true
  const [focusedIndex, setFocusedIndex] = useState(0); // current focused index

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

        const clearResponses: Array<AllClear> = [];
        const problemResponses: Array<AllClear> = [];
        allClearsResponse.data.data.forEach((elem: AllClear) => {
          if (elem.type === AllClearResponseType.CLEAR) {
            clearResponses.push(elem);
          } else if (elem.type === AllClearResponseType.PROBLEM) {
            problemResponses.push(elem);
          }
        });

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
        <AngleBracketHeader
          categoryName={'통계 확인'}
          onPressBack={() =>
            navigation.navigate('Chat', { chatroomId: chatroomId })
          }
        />

        <View style={styles.customNavigator}>
          <Pressable
            key={0}
            style={styles.tabBarContainer}
            onPress={() => {
              setFocusedIndex(0);
            }}
          >
            <FontAwesome5
              name="user-check"
              size={20}
              color={focusedIndex === 0 ? focusedColor : unfocusedColor}
            />
            <Text
              style={[
                styles.tabBarText,
                { color: focusedIndex === 0 ? focusedColor : unfocusedColor },
              ]}
            >
              {clears.length}
            </Text>
          </Pressable>

          <Pressable
            key={1}
            style={styles.tabBarContainer}
            onPress={() => {
              setFocusedIndex(1);
            }}
          >
            <MaterialIcons
              name="report-problem"
              size={24}
              color={focusedIndex === 1 ? focusedColor : unfocusedColor}
            />
            <Text
              style={[
                styles.tabBarText,
                { color: focusedIndex === 1 ? focusedColor : unfocusedColor },
              ]}
            >
              {problems.length}
            </Text>
          </Pressable>

          <Pressable
            key={2}
            style={styles.tabBarContainer}
            onPress={() => {
              setFocusedIndex(2);
            }}
          >
            <Entypo
              name="eye-with-line"
              size={24}
              color={focusedIndex === 2 ? focusedColor : unfocusedColor}
            />
            <Text
              style={[
                styles.tabBarText,
                { color: focusedIndex === 2 ? focusedColor : unfocusedColor },
              ]}
            >
              {clears.length}
            </Text>
          </Pressable>
        </View>

        <View style={styles.contentContainer}>
          {focusedIndex === 2 ? (
            <Unreads
              isLoading={isLoading}
              isFault={isFault}
              isError={isError}
              list={unreads}
              categoryName={'읽지 않은 전우들'}
            />
          ) : focusedIndex === 1 ? (
            <AllClearResponse
              key={1}
              isLoading={isLoading}
              isFault={isFault}
              isError={isError}
              list={problems}
              categoryName={'특이사항 보고 상세'}
            />
          ) : (
            <AllClearResponse
              key={0}
              isLoading={isLoading}
              isFault={isFault}
              isError={isError}
              list={clears}
              categoryName={'이상 무 보고 상세'}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  customNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
  },
  navigatorTab: {
    height: '100%',
    flexDirection: 'column',
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarText: {
    textAlign: 'center',
  },

  contentContainer: {
    flex: 1,
  },
});
