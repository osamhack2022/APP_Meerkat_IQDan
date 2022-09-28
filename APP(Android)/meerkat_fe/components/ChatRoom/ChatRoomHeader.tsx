import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const BackButton = (props: {onPress: () => void}) => {
  return (
    <View>
      <Text style={styles.headerText} onPress={props.onPress}>{'<'}</Text>
    </View>
  )
}

const Title = (props: {}) => {
  return (
    <View>
      <Text style={styles.headerText}>{"본부대대 1중대"}</Text>
    </View>
  )
}

const Menu = (props: {}) => {
  return (
    <View>
      <Text style={styles.headerText}>{'☰'}</Text>
    </View>
  )
}

interface ChatRoomHeaderProps {
  onPressBack: () => void
}

const ChatRoomHeader = (props: ChatRoomHeaderProps) => {
  return (
    <SafeAreaView style={styles.header}>
      <BackButton onPress={props.onPressBack}/>
      <Title/>
      <Menu/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "orange",
    alignItems: "flex-end",
    paddingTop: 12,
    paddingBottom: -12
  },
  headerText: {
    fontSize: 24,
    color: "white"
  }
})

export default ChatRoomHeader;
