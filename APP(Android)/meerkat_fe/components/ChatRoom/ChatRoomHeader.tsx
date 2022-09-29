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

const Menu = (props: {onPress : () => void}) => {
  return (
    <View>
      <Text style={{fontSize: 48, color: "white"}} onPress={props.onPress}>{'☰'}</Text>
    </View>
  )
}

interface ChatRoomHeaderProps {
  onPressBack: () => void,
  onPressSideMenu: () => void
}

const ChatRoomHeader = (props: ChatRoomHeaderProps) => {
  return (
    <SafeAreaView style={styles.header}>
      <BackButton onPress={props.onPressBack}/>
      <Title/>
      <Menu onPress={props.onPressSideMenu}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "orange",
    alignItems: "flex-end",
  },
  headerText: {
    fontSize: 24,
    color: "white"
  }
})

export default ChatRoomHeader;
