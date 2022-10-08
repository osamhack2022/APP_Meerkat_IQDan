import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView, Animated } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import DrawerUser from "./DrawerComp/DrawerUser";

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DURATION = 300;

interface ChatroomSideProps {
  isOpen: boolean,
  setIsOpen: (open: boolean) => void
}

const ChatroomSide = (props: ChatroomSideProps) => {
  const opacityAnimValue = useRef(new Animated.Value(0)).current;
  const posAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.isOpen) {
      Animated.timing(opacityAnimValue, { useNativeDriver:true, toValue:0.5, duration: DURATION }).start()
      Animated.timing(posAnimValue, { useNativeDriver:false, toValue:1, duration: DURATION }).start()
    }
  }, [props.isOpen]);

  const close = () => {
    Animated.timing(opacityAnimValue, { useNativeDriver:true, toValue:0, duration: DURATION }).start()
    Animated.timing(posAnimValue, { useNativeDriver:false, toValue:0, duration: DURATION }).start(() => {
      props.setIsOpen(false);
    })
  }

  if (!props.isOpen) return null;

  return (
    <View style={styles.drawer}>
      <AnimatedPressable onPress={close} style={[styles.outside, {opacity: opacityAnimValue}]}>
      </AnimatedPressable>
      <AnimatedSafeAreaView style={[styles.inside, {right:  posAnimValue.interpolate({ inputRange: [0, 1], outputRange: ["-65%", "0%"] }) }]}>
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
      </AnimatedSafeAreaView>
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

export default ChatroomSide;
