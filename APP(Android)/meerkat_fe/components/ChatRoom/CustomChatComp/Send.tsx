import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, IMessage, Send, SendProps } from "react-native-gifted-chat";

const MKSend = (props: SendProps<IMessage>) => {
  return (
    <Send {...props} containerStyle={{ justifyContent: 'center' }}>
      <Text>Send</Text>
    </Send>
  )
}

export default MKSend;
