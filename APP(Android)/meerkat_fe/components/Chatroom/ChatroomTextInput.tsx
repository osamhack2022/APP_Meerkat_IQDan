import React, { useState, useCallback, useEffect, Fragment } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

interface ChatroomTextInputProps {
  onSendTextMessage: (msg: string) => void;
  msgInput: string;
  setMsgInput: (msg: string) => void;
}

const ChatroomTextInput = (props: ChatroomTextInputProps) => {
  const { msgInput, setMsgInput } = props;

  const onSend = () => {
    props.onSendTextMessage(msgInput);
    setMsgInput('');
  };

  return (
    <View
      style={{ backgroundColor: 'white', padding: 4, flexDirection: 'row' }}
    >
      <TextInput
        selectionColor={'#6A4035'}
        multiline
        editable={true}
        placeholder={'메세지를 입력하세요'}
        style={{
          backgroundColor: '#EEE',
          fontSize: 14,
          paddingLeft: 5,
          flexGrow: 1,
          borderRadius: 8,
          marginRight: 4,
          lineHeight: 20,
          padding: 8,
          maxWidth: '90%',
        }}
        value={msgInput}
        onChangeText={t => setMsgInput(t)}
      />
      <Pressable
        onPress={onSend}
        disabled={msgInput === ''}
        style={{
          backgroundColor: msgInput === '' ? '#EEE' : 'black',
          justifyContent: 'center',
          borderRadius: 8,
          padding: 8,
          maxWidth: "10%"
        }}
      >
        {/* <MaterialIcons size={32} color="#EEE" name="arrow-upward" /> */}
        {/* <FontAwesome name="send" size={24} color="#6A4035" /> */}
        <FontAwesome name="send-o" size={22} color="white" />
      </Pressable>
    </View>
  );
};

export default ChatroomTextInput;
