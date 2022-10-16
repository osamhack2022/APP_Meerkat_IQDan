// core
import { useEffect, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  TextInput,
  Button,
  Image,
  Keyboard,
  TouchableOpacity,
  DeviceEventEmitter,
  Touchable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// type
import {
  MainTabScreenProps,
  RootStackParamList,
  TabParamList,
  User,
  UserEvent,
} from '../common/types.d';

import FriendListLoading from '../components/FriendList/FriendListLoading';
import api from '../common/api';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { getImage } from '../common/getImage';

type AddFriendScreenProps = CompositeScreenProps<
  StackScreenProps<RootStackParamList, 'AddFriend'>,
  BottomTabScreenProps<TabParamList>
>;

export default function AddFriend(props: AddFriendScreenProps) {
  const { navigation } = props;

  const [name, setName] = useState('');
  const [sn, setSn] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  const addAsFriend = () => {
    api
      .post('/friends', {
        followingId: user?.userId,
      })
      .then(res => {
        console.log('friend added');
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        DeviceEventEmitter.emit('fetchFriends');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const search = () => {
    Keyboard.dismiss();

    api
      .post('/users/friends', {
        name: name,
        serviceNumber: sn,
      })
      .then(res => {
        let user = res.data.data;
        console.log(user);
        setUser(user);
        setNotFound(false);
      })
      .catch(err => {
        setUser(null);
        setNotFound(true);
        console.log(err);
      });
  };

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <SafeAreaView>
        <AntDesign
          style={{ left: 20, position: 'absolute', top: 50 }}
          name="arrowleft"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
        />

        <View style={{ alignItems: 'center', paddingTop: 36 }}>
          <Text style={styles.text}>이름</Text>
          <TextInput
            onChangeText={setName}
            value={name}
            style={styles.textBox}
          />
          <Text style={styles.text}>군번</Text>
          <TextInput
            onChangeText={setSn}
            value={sn}
            style={styles.textBox}
            keyboardType="numbers-and-punctuation"
          />
          <Button onPress={search} color="#6A4035" title="찾기" />
        </View>
        <View style={{ height: 36 }} />
        {notFound && (
          <Text
            style={{
              fontSize: 24,
              alignSelf: 'center',
              fontFamily: 'noto-med',
            }}
          >
            유저를 찾을 수 없습니다.
          </Text>
        )}
        {added && (
          <Text
            style={{
              fontSize: 24,
              alignSelf: 'center',
              fontFamily: 'noto-med',
            }}
          >
            해당 유저를 전우로 추가하였습니다.
          </Text>
        )}
        {user && (
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
              <View style={styles.row}>
                <TouchableOpacity onPress={addAsFriend}>
                  <MaterialIcons
                    size={40}
                    name="person-add"
                    style={{ marginTop: 22 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  eventContainer: {
    marginLeft: 17,
    height: 75,
  },
  textBox: {
    lineHeight: 20,
    width: 250,
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
    fontFamily: 'noto-med',
  },
  text: {
    lineHeight: 40,
    fontFamily: 'noto-bold',
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
