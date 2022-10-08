import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";

const MKBubble = (props: {}) => {
  return (
    <Bubble
      {...props}
      textStyle={{
        left: {
          color: "#000"
        },
        right: {
          color: "#FFF",
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: "#E5B47F"
        },
        right: {
          backgroundColor: "#6A4035",
        }
      }}
    />
  )
}

export default MKBubble;
