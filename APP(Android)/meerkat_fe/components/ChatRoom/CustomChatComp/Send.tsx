import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, IMessage, Send, SendProps } from "react-native-gifted-chat";
import { MaterialIcons } from '@expo/vector-icons'

const MKSend = (props: SendProps<IMessage>) => {
  return (
    <View style={{paddingRight: 8}}>
      <Send {...props} containerStyle={{ justifyContent: 'center' }}>
        <MaterialIcons size={32} color="#DDD" name='arrow-upward' />
      </Send>
    </View>
  )
}

export default MKSend;
