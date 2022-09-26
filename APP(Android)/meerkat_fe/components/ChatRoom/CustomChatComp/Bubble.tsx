import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";

const MKBubble = (props: {}) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#A00"
        },
        left: {
          backgroundColor: "orange"
        }
      }}
    />
  )
}

export default MKBubble;
