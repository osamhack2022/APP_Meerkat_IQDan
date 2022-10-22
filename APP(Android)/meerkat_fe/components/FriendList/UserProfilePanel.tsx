import AsyncStorage, {
  AsyncStorageStatic,
} from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
} from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import { User, UserProfile } from '../../common/types';
import api from '../../common/api';
import { getImage } from '../../common/getImage';
import FriendDetailBox from './FriendDetailBox';

interface UserProfilePanelProps {
  user: User | null;
  setUser: (user: User | null) => void;
  onClose: () => void;
  gotoChat: () => void;
  onDeleteFriend: () => void;
}

const requestDeleteFriend = async (
  user: User,
  onDeletionSuccess: () => void,
) => {
  let userToken = await AsyncStorage.getItem('userToken');
  api
    .delete('/friends', {
      headers: {
        Authorization: 'Bearer ' + userToken,
      },
      data: {
        followingId: user.userId,
      },
    })
    .then(async res => {
      onDeletionSuccess();
    })
    .catch(err => {
      // TODO : show error
      console.log(err.response);
    });
};

const UserProfilePanel = (props: UserProfilePanelProps) => {
  const { user } = props;

  useEffect(() => {}, []);

  if (user == null) return null;

  const deleteUser = () => {
    Alert.alert('유저 삭제', '이 유저를 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: () => requestDeleteFriend(user, props.onDeleteFriend),
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        zIndex: 100,
        bottom: 0,
        backgroundColor: '#FFF9D2',
        // borderTopWidth: 2,
        borderTopColor: '#6A4035',
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width:"100%",
          paddingBottom: 25,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingRight: 12,
          }}
        >
          <Pressable onPress={props.onClose}>
            <MaterialIcons
              size={30}
              name="close"
              color="#6A4035"
              style={{ padding: 5 }}
            />
          </Pressable>
        </View>
        <View style={styles.friendDetailBoxContainer}>
          <FriendDetailBox
            uid={user.uid}
            name={user.name}
            serviceNumber={user.serviceNumber}
            affiliatedUnit={user.affiliatedUnit}
            militaryRank={user.militaryRank}
            image={user.image}
          />
        </View>

        <View style={styles.removeBoxContainer}>
          <TouchableOpacity style={styles.removeBox} onPress={deleteUser}>
            <Text style={styles.removeBoxText}>전우 목록에서 제거</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  userInfoSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendDetailBoxContainer:{
    paddingTop:25,
  },
  removeBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  removeBox: {
    marginTop: 30,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    width:350,
    height: 50,
    backgroundColor: '#6A4035',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBoxText: {
    fontFamily: 'noto-reg',
    fontSize: 15,
    lineHeight: 20,
    color: 'white',
  },
});

export default UserProfilePanel;

{
  /* <TouchableOpacity onPress={deleteUser}>
              <MaterialIcons size={40} name="person-remove" />
            </TouchableOpacity> */
}
