import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Bubble, GiftedChat, IMessage, Send, SendProps } from "react-native-gifted-chat";

const MKActions = () => {
  const onActionsPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ]
  }

  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={onActionsPress}
    >
      <View style={[styles.wrapper]}>
        <Text style={[styles.iconText]}>+</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

export default MKActions;
