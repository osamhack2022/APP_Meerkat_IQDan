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
  Alert,
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

import AngleBracketHeader from '../components/AngleBracketHeader';
import FriendDetailBox from '../components/FriendList/FriendDetailBox';

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
        Alert.alert('해당 유저를 전우로 추가하였습니다.');
      })
      .catch(err => {
        console.log(err);
        Alert.alert('이미 전우인 유저입니다.');
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
      <AngleBracketHeader
        onPressBack={() => navigation.goBack()}
        categoryName={''}
      />
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.textInputContainer}>
          <View style={styles.textHeaderContainer}>
            <Text style={styles.textHeader}>전우 찾기</Text>
            <Text style={styles.textSubHeader}>
              이름과 군번으로 전우를 추가할 수 있습니다.
            </Text>
          </View>
          <TextInput
            onChangeText={setName}
            value={name}
            placeholder="이름"
            style={styles.textInputBox}
          />
          <TextInput
            onChangeText={setSn}
            value={sn}
            style={styles.textInputBox}
            placeholder="군번"
            keyboardType="numbers-and-punctuation"
          />
          <TouchableOpacity style={styles.searchBox} onPress={search}>
            <Text style={styles.searchBoxText}>찾기</Text>
          </TouchableOpacity>
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
        {user && (
          <View>
            <View style={styles.friendDetailContainer}>
              <FriendDetailBox
                uid={user.uid}
                name={user.name}
                serviceNumber={user.serviceNumber}
                affiliatedUnit={user.affiliatedUnit}
                militaryRank={user.militaryRank}
                image={user.image}
              />
              {/* <TouchableOpacity style={styles.addBox} onPress={addAsFriend}> */}
              <TouchableOpacity style={styles.addBox} onPress={()=>{addAsFriend();}}>
                <Text style={styles.searchBoxText}>추가</Text>
              </TouchableOpacity>
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
    flexDirection:"column",
    justifyContent:"flex-start"
  },
  textInputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 300,
  },
  textHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
  },
  textHeader: {
    fontFamily: 'noto-bold',
    fontSize: 25,
    lineHeight: 40,
  },
  textSubHeader: {
    fontFamily: 'noto-reg',
    fontSize: 15,
    lineHeight: 20,
  },
  textInputBox: {
    lineHeight: 20,
    height: 50,
    width: '70%',
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: '#6A4035',
    backgroundColor: '#FFF9D2',
    color: '#6A4035',
    borderRadius: 10,
    fontFamily: 'noto-med',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    borderRadius: 10,
    width: '50%',
    height: 50,
    backgroundColor: '#6A4035',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBoxText: {
    fontFamily: 'noto-reg',
    fontSize: 15,
    lineHeight: 20,
    color: 'white',
  },
  friendDetailContainer: {
    width: '80%',
    backgroundColor: '#FFF9D2',
    alignSelf: 'center',
    paddingTop: 25,
    paddingBottom: 25,
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius:12
  },
  addBox: {
    marginTop: 30,
    borderRadius: 10,
    width: '80%',
    height: 50,
    backgroundColor: '#6A4035',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
