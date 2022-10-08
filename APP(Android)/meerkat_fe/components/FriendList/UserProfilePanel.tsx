import AsyncStorage, { AsyncStorageStatic } from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { Image, Modal, StyleSheet, Text, Pressable, View, KeyboardAvoidingView, SafeAreaView, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { User, UserProfile } from "../../common/types";
import getProfileSource from "./getProfileSource";
import axios from "axios";

interface UserProfilePanelProps {
  user: User|null
  setUser: (user: User|null) => void
  onClose: () => void
  gotoChat: () => void
}

const requestDeleteFriend = async (user: User) => {
  let userToken = await AsyncStorage.getItem("userToken")
  return;
  axios
    .get("https://code.seholee.com:8082/friends", {
      headers: {
        Authorization: "Bearer " + userToken,
      },
    })
    .then(async (res) => {
      let friends = res.data.data;
    })
    .catch((err) => {
      // TODO : show error
      console.log(err.response);
    })
};

const UserProfilePanel = (props: UserProfilePanelProps) => {
  const { user } = props;  

  useEffect(() => {
  }, []);

  if (user == null) return null;

  const ProfileImageSource = getProfileSource(user.image);

  const deleteUser = () => {
    Alert.alert(
      "유저 삭제",
      "이 유저를 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel"
        },
        { text: "삭제", onPress: () => requestDeleteFriend(user) }
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, position: "absolute", width: "100%", height: "100%", backgroundColor: "#FFF", zIndex: 100 }}>
      <View style={{flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "flex-end", paddingRight: 24 }}>
          <Pressable onPress={props.onClose}>
            <MaterialIcons size={48} name="close" />
          </Pressable>
        </View>
        <View style={{backgroundColor: "pink"}}>
          <View>
            <Text>{JSON.stringify(user)}</Text>
          </View>
          <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", paddingVertical: 24}}>
            <Image style={styles.profileImage} source={ProfileImageSource}/>
            <Text style={{fontSize: 24, paddingTop: 12}}>{`${user.militaryRank} ${user.name}`}</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", paddingBottom: 12}}>
            <TouchableOpacity onPress={() => { props.setUser(null); props.gotoChat();}}>
              <MaterialIcons size={52} name='chat' />
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteUser}>
              <MaterialIcons size={52} name='person-remove' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 24,
  },
});

export default UserProfilePanel;

