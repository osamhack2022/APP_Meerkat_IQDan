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
  KeyboardAvoidingView,
  SafeAreaView,
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
        backgroundColor: "#E5B47F",
        // borderTopWidth: 2,
        borderTopColor: "#6A4035",
      }}
    >
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            paddingRight: 12,
          }}
        >
          <Pressable onPress={props.onClose}>
            <MaterialIcons size={38} name="close" color="#6A4035" style={{padding: 5}} />
          </Pressable>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 24,
            }}
          >
            <Image style={styles.profileImage} source={getImage(user.image)} />
            <Text
              style={{ fontSize: 24, paddingTop: 12 }}
            >{`${user.militaryRank} ${user.name}`}</Text>
          </View>
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Feather name="home" color="#black" size={20} />
              <Text style={{ color: 'black', marginLeft: 20 }}>소속부대</Text>
              <Text style={{ color: '#777777', marginLeft: 20 }}>
                {user.affiliatedUnit}
              </Text>
            </View>
            <View style={styles.row}>
              <MaterialIcons
                name="confirmation-number"
                color="#black"
                size={20}
              />
              <Text style={{ color: 'black', marginLeft: 20 }}>군번</Text>
              <Text style={{ color: '#777777', marginLeft: 20 }}>
                {user.serviceNumber}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingVertical: 24,
            }}
          >
            {/* <TouchableOpacity onPress={() => { props.setUser(null); props.gotoChat(); }}> */}
            {/* <MaterialIcons size={48} name='chat' /> */}
            {/* </TouchableOpacity> */}
            <TouchableOpacity onPress={deleteUser}>
              <MaterialIcons size={40} name="person-remove" />
            </TouchableOpacity>
          </View>
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
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  userInfoSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfilePanel;
