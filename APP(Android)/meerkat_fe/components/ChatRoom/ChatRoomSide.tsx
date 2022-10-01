import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerUser from "./DrawerComp/DrawerUser";

const ChatRoomSide = (props: {onClickOutside: () => void}) => {
  return (
    <View style={styles.drawer}>
      <Pressable onPress={props.onClickOutside} style={styles.outside}>
      </Pressable>
      <SafeAreaView style={styles.inside}>
        <View>
          <Text>대화상대</Text>
        </View>
        <ScrollView>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
          <DrawerUser name={"1중대장"}/>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  outside: {
    backgroundColor: "black",
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5
  },
  inside: {
    backgroundColor: "pink",
    position: "absolute",
    width: "65%",
    height: "100%",
    top: 0,
    bottom: 0,
    right: 0
  },
  drawer: {
    width: "100%",
    height: "100%",
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
})

export default ChatRoomSide;
