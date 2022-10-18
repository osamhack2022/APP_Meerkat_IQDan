import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, View, Text, StyleSheet } from 'react-native';
import { isEmpty } from '../common/isEmpty';
import { AllClear, RootStackParamList } from '../common/types';
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
import CategoryBoxLoading from '../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../components/FriendList/FriendBoxLoading';
import { generateJSX } from '../common/generateJSX';
import api from '../common/api';

type ReportAllClearProps = StackScreenProps<
  RootStackParamList,
  'ReportAllClear'
>;

// 나의 응답

export default function ReportAllClear(props: ReportAllClearProps) {
  // params
  const { navigation } = props;
  const { messageId, chatroomId } = props.route.params;

  // data


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

  // 입력받기
  const readData = () => {
    return (
      <>
        
      </>
    );
  };

  return (
    <>
      <ChatroomHeader
        onPressBack={() =>
          navigation.navigate('Chat', { chatroomId: chatroomId })
        }
        name={''}
      />
      {readData()}
    </>
  );
}

const styles = StyleSheet.create({
  empty: {
    position: 'absolute',
    //backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
