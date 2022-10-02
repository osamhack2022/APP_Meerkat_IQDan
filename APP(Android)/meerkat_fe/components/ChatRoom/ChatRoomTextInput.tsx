import React, { useState, useCallback, useEffect, Fragment } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView, TextInput } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'

interface ChatRoomTextInputProps {
  onSendTextMessage: (msg: string) => void
}

const ChatRoomTextInput = (props: ChatRoomTextInputProps) => {
  let [msgInput, setMsgInput] = useState("");

  const onSend = () => {
    props.onSendTextMessage(msgInput);
    setMsgInput("");
  }

  return (
    <View style={{ backgroundColor: "#CCC", padding: 6, flexDirection: "row" }}>
      <TextInput
        multiline
        editable={true}
        placeholder={"메세지를 입력하세요"}
        style={{ backgroundColor: "#EAEAEA", borderRadius: 8, fontSize: 18, paddingLeft: 12, flexGrow: 1, marginRight: 4 }}
        value={msgInput}
        onChangeText={(t) => setMsgInput(t)}
      />
      <TouchableOpacity onPress={onSend} style={{backgroundColor: "#DDD", justifyContent: "center", borderRadius: 8}}>
        <MaterialIcons size={32} color="#EEE" name='arrow-upward' />
      </TouchableOpacity>
    </View>
  )
}

export default ChatRoomTextInput;
