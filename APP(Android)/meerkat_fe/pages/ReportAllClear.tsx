import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  View,
  Text,
  Button,
  Alert,
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

  // state
  const [isSubmitActive, setIsSubmitActive] = useState(true);

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

  const enableSubmit = () => {
    setIsSubmitActive(true);
  };

  const disableSubmit = () => {
    setIsSubmitActive(false);
  };

  const submitAllClear = () => {
    disableSubmit();
    if (content === '') {
      enableSubmit();
      return Alert.alert('내용을 입력해 주세요.');
    }

    console.log(messageId);
    console.log(allClearType);
    console.log(content);

    api
      .put(`/allclear/response/create`, {
        messageId: messageId,
        allClearResponseType: allClearType,
        content: content,
      })
      .then(() => {
        Alert.alert("보고가 완료되었습니다.");
        navigation.navigate('Chat', { chatroomId: chatroomId });
        
      })
      .catch((e) => {
        console.log(e.response);
        enableSubmit();
        return Alert.alert('서버와의 통신이 원활하지 않습니다.');
      });
  };

  return (
    <>
      <ChatroomHeader
        onPressBack={() =>
          navigation.navigate('Chat', { chatroomId: chatroomId })
        }
        name={''}
      />

      <View style={styles.empty}>
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
          <TextInput
            style={styles.input}
            onChangeText={setContent}
            value={content}
          />
        </Pressable>
      </View>
      <View style={{ alignItems: 'center' }}></View>
      <Button onPress={submitAllClear} title="제출하기" color="#6A4035" />
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
  input: {
    backgroundColor: 'gray',
    height: '70%',
    width: 300,
  },
});
