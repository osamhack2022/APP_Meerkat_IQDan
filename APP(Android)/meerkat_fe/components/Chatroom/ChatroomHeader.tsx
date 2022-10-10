import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Touchable } from "react-native";
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 

const BackButton = (props: {onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <AntDesign style={{color: "#6A4035",  marginLeft: 20}}  name="arrowleft" size={24} color="black" />
    </TouchableOpacity>
  )
}

const Title = (props: {name: string}) => {
  return (
    <View>
      <Text style={styles.headerText}>{props.name}</Text>
    </View>
  )
}

const Menu = (props: {onPress : () => void}) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Feather style={{ color: "#6A4035", marginRight: 20, marginBottom: 1}}  name="menu" size={26} color="black" />
    </TouchableOpacity>
  )
}

interface ChatroomHeaderProps {
  onPressBack: () => void,
  onPressSideMenu: () => void,
  name: string
}

const ChatroomHeader = (props: ChatroomHeaderProps) => {
  return (
    <View style={[styles.header]}>
      <BackButton onPress={props.onPressBack}/>
      <Title name={props.name}/>
      <Menu onPress={props.onPressSideMenu}/>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 35,
    height: 50,
    // borderBottomWidth: 1,
    borderBottomColor: "#6A4035"
  },
  headerText: {
    fontSize: 18,
    color: "#6A4035",
    fontFamily: "noto-med",
    lineHeight: 48
  }
})

export default ChatroomHeader;
