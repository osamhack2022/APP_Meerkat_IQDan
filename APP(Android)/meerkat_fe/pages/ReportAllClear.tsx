import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
} from 'react-native';
import { isEmpty } from '../common/isEmpty';
import {
  AllClear,
  AllClearResponseType,
  RootStackParamList,
} from '../common/types.d';
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
import CategoryBoxLoading from '../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../components/FriendList/FriendBoxLoading';
import { generateJSX } from '../common/generateJSX';
import api from '../common/api';
import Select from './ChatroomList/Select';

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
  const [allClearType, setAllClearType] = useState<AllClearResponseType>(
    AllClearResponseType.CLEAR,
  );
  const [content, setContent] = useState('');
  const [closeFlag, setCloseFlag] = useState(true);

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
  const handleClose = (closeFlag: boolean) => {
    setCloseFlag(!closeFlag);
  };

  const readData = () => {
    return (
      <>
        <Pressable onPress={() => handleClose(closeFlag)}>
          <Select
            allValues={[
              AllClearResponseType.CLEAR,
              AllClearResponseType.PROBLEM,
            ]}
            currValue={AllClearResponseType.CLEAR}
            setCurrValue={setAllClearType}
            closeFlag={false}
          />
          <TextInput onChangeText={setContent} value={content} />
        </Pressable>
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
