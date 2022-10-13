// core
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity,Text, Alert, Image,Animated } from "react-native";
import {
    MaterialCommunityIcons,
    Feather,
    MaterialIcons,
    AntDesign
} from "@expo/vector-icons";
import * as reactNativePaper from 'react-native-paper';

import getGlitterStyle from "../components/FriendList/getGlitterStyle";

// thirds
import AsyncStorage from "@react-native-async-storage/async-storage";
// types
import { MainTabScreenProps, AnimatedValue, User } from "../common/types";
// context
import { LoginContext } from "../common/Context";
import api from "../common/api";


import getProfileSource from "../components/FriendList/getProfileSource";
import { useIsFocused } from "@react-navigation/native";

const FriendListKey = "FriendList";

export default function SettingsLoading() {
  const animatedValue = useRef(new Animated.Value(0.4)).current;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <reactNativePaper.Text style={styles.title}>설정</reactNativePaper.Text>
            </View>

      <View style={styles.userInfoSection}>
          <View style={{ flexDirection: 'row', alignItems:"center" }}>
          <View style={styles.profileImage}>
                <Animated.View style={getGlitterStyle(animatedValue)} />
            </View>
            <View style={{ marginLeft: 20 }}>
              <View style={styles.titleText}>
                    <Animated.View style={getGlitterStyle(animatedValue)} />
                </View>
                <View style={styles.caption}>
                    <Animated.View style={getGlitterStyle(animatedValue)} />
                </View>
                <View style={styles.captionForStatus}>
                    <Animated.View style={getGlitterStyle(animatedValue)} />
                </View>
            </View>
          </View>
        </View>


        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>

            <Feather name="home" color="#6A4035" size={20} />
            <Text style={{ color: "black", marginLeft: 20, fontFamily: "noto-bold", }}>소속부대</Text>
            <View style={styles.nameText}>
                    <Animated.View style={getGlitterStyle(animatedValue)} />
                </View>
          </View>
          <View style={styles.userInfo}>
            <MaterialIcons name="confirmation-number" color="#6A4035" size={20} />
            <Text style={{ color: "black", marginLeft: 20, fontFamily: "noto-bold", }}>군번        </Text>
            <View style={styles.nameText}>
                    <Animated.View style={getGlitterStyle(animatedValue)} />
                </View>
          </View>
          <View style={styles.userInfo}>
            <AntDesign name="idcard" size={20} color="#6A4035" />
            <Text style={{ color: "black", marginLeft: 20, fontFamily: "noto-bold", }}>아이디    </Text>
            <View style={styles.nameText}>
                    <Animated.View style={getGlitterStyle(animatedValue)} />
                </View>

          </View>
        </View>

      <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>

            <reactNativePaper.Title style={styles.infoBoxText}>D-0</reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.captionForBig}>전역까지</reactNativePaper.Caption>
          </View>
          <View style={styles.infoBox}>
            <reactNativePaper.Title style={styles.infoBoxText}>0</reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.captionForBig}>전우</reactNativePaper.Caption>

          </View>
      </View>

      <View style={styles.menuWrapper}>
        <reactNativePaper.TouchableRipple onPress={()=>{}}>
          <View style={styles.menuItem}>

          <MaterialCommunityIcons name="key-change" size={24} color="#6A4035" />
            <Text style={styles.menuItemText}>비밀번호 변경</Text>

          </View>
        </reactNativePaper.TouchableRipple>
        <reactNativePaper.TouchableRipple onPress={()=>{}}>
          <View style={styles.menuItem}>

          <AntDesign name="profile" size={24} color="#6A4035" />
            <Text style={styles.menuItemText}>프로필 변경</Text>

          </View>
        </reactNativePaper.TouchableRipple>

        <reactNativePaper.TouchableRipple onPress={()=>{}}>
            <View style={styles.menuItem}>
              <AntDesign name="key" size={24} color="#6A4035" />
              <Text style={styles.menuItemText}>보안키 생성</Text>
            </View>
          </reactNativePaper.TouchableRipple>

        <reactNativePaper.TouchableRipple onPress={()=>{}}>
          <View style={styles.menuItem}>

          <MaterialIcons name="logout" size={24} color="#6A4035" />
            <Text style={styles.menuItemText}>로그아웃</Text>

          </View>
        </reactNativePaper.TouchableRipple>
      </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10
    },
    title: {
        fontSize: 25,
        fontFamily: "noto-bold",
        lineHeight: 45,
    },
    menucontainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E5B47F",
        margin: 5,
        paddingLeft: 20,
        borderRadius: 10,
    },
    menuTitle: {
        fontSize: 20,
        fontFamily: "noto-med",
        color: "#6A4035",
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 25,
    },
    captionForBig: {
      fontSize: 14,
      lineHeight: 16,
      fontWeight: '500',
      fontFamily: "noto-bold",
      color: '#6A4035',
    },
    captionForStatus:{
      marginTop:10,
      height: 14,
      lineHeight: 16,
      width: 90,
      backgroundColor: '#DBDBDB',
    },

    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    column: {
        flexDirection: 'column',
        marginBottom: 10,
      }
    ,
    infoBoxWrapper: {
      flexDirection: 'row',
      height: 100,
      borderRadius: 20,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#E5B47F',
      fontFamily: "noto-bold",
      borderRadius: 20,
      margin:2
    },
    infoBoxText:{
      fontFamily: "noto-bold",
      color: 'white',
    },
    menuWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
      marginTop: 10,
    },
    menuItem: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
      
    },
    menuItemText: {
      color: '#6A4035',
      marginLeft: 20,
      fontFamily: "noto-bold",
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 17,
      backgroundColor: "#DBDBDB",
    },
    userInfo:{
      flexDirection: 'row',
      alignItems: 'center'
    },
    nameText: {
      lineHeight: 25,
      height: 20,
      backgroundColor: "#DBDBDB",
      width: 60,
      marginLeft: 20
  },
  titleText: {
    lineHeight: 25,
    height: 20,
    backgroundColor: "#DBDBDB",
    width: 80,
},
caption: {
  marginTop:5,
  height: 14,
  width:40,
  lineHeight: 16,
  backgroundColor: '#DBDBDB',
},
});
