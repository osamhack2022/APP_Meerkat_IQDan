// core
import { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import * as reactNativePaper from 'react-native-paper';


// thirds
import AsyncStorage from '@react-native-async-storage/async-storage';
// types
import { MainTabScreenProps, User } from '../common/types';
// context
import { LoginContext } from '../common/Context';
import api from '../common/api';

import SettingsLoading from '../pages/SettingsLoading';
import { useIsFocused } from '@react-navigation/native';

import { generateRSAKeys } from '../common/crypto';
import { getImage } from '../common/getImage';

const FriendListKey = 'FriendList';

export default function Settings(props: MainTabScreenProps<'Settings'>) {
  const { navigation } = props;
  const { checkIfLoggedIn } = useContext(LoginContext);
  const [user, setUser] = useState<User | null>(null);
  const [dDay, setDDday] = useState<string | number>(0); // TODO: type number로 추후 수정.
  const [pageState, setPageState] = useState<string>('loading');
  const [friends, setFriends] = useState<User[]>([]);
  const [generating, setGenearting] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
    if (isFocused) {
      (async () => {
        //setPageState("loading");
        await fetchFromAsyncStorage();
        // await sleep(2);

        await fetchFriends();
        await fetchMe();
        await sleep(0.7);
        setPageState('loaded');
      })();
    }
  }, [isFocused]);

  const fetchMe = async () => {
    api
      .get('/users/me')
      .then(res => {
        let data = res.data.data as User;
        setUser(data);
        setDDday(computedDday(data.enlistmentDate));
      })
      .catch(err => {
        console.log(err);
      });
  };
  const fetchFromAsyncStorage = async () => {
    let friends = JSON.parse(
      (await AsyncStorage.getItem(FriendListKey)) || '[]',
    );

    setFriends(friends);
  };

  const fetchFriends = async () => {
    // axios get 후에 async storage set
    // async storge에 넣고, async에서 받아오고, 그걸 리턴하면 ?

    let userToken = await AsyncStorage.getItem('userToken');

    api
      .get('/friends', {
        headers: {
          Authorization: 'Bearer ' + userToken,
        },
      })
      .then(async res => {
        let friends = res.data.data;
        setFriends(friends);
        AsyncStorage.setItem(FriendListKey, JSON.stringify(friends));
      })
      .catch(err => {
        // TODO : show error
        setPageState('error');
        console.log(err.response);
      });
  };

  const sleep = (time: number) => {
    return new Promise(resolve => {
      setTimeout(() => resolve('slept well'), time * 1000);
    });
  };

  const computedDday = (enlistmentDate: any) => {
    const currentDate = new Date();
    const altarDateToDate = new Date(enlistmentDate);
    altarDateToDate.setMonth(altarDateToDate.getMonth()+18);
    altarDateToDate.setDate(altarDateToDate.getDate()-1);

    const diffDate = currentDate.getTime() - altarDateToDate.getTime();
    const dDay= Math.floor(diffDate / (1000 * 60 * 60 * 24));
    if (dDay>0){
      return '+'+dDay;
    }
    return dDay;
  };

  const handleMyProfile = () => {
    navigation.navigate('MyProfile');
  };

  const handleChangePw = () => {
    navigation.navigate('ChangePw');
  };

  const handleRemoveUser = () => {
    Alert.alert(':/', '현재 지원되지 않는 기능입니다.', [
      {
        text: '확인',
        onPress: () => {},
      },
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.setItem('userToken', '');
    await AsyncStorage.setItem('userTokenExpiration', '');
    // FIXME : 로그아웃 시 없애기 => 해놓은 상태임.
    const allKeys = await AsyncStorage.getAllKeys()
    await Promise.all(allKeys.map((key) => {
      return AsyncStorage.removeItem(key)
    }))
    checkIfLoggedIn();
    navigation.navigate('Auth');
  };

  const generateKeys = async () => {
    DeviceEventEmitter.emit('loading_started');
    setTimeout(async () => {
      let keys = generateRSAKeys();

      try {
        let res = await api.post('/users/publicKey', {
          publicKey: keys.getPublicKey(),
        });

        await AsyncStorage.setItem('PublicKey', keys.getPublicKey());
        await AsyncStorage.setItem('PrivateKey', keys.getPrivateKey());

        Alert.alert('보안키 생성 및 갱신 완료', keys.getPublicKey());
      } catch (e) {
        console.log(e);
        Alert.alert(
          '보안키 생성 실패',
          '서버에 공개키를 업로드 하지 못했습니다.',
        );
      } finally {
        DeviceEventEmitter.emit('loading_ended');
      }
    }, 1000);
  };

  if (pageState == 'loading' || user === null) {
    return <SettingsLoading />;
  } else if (pageState == 'error') {
    return (
      <View>
        <Text>Error!!!!</Text>
      </View>
    );
  }
  return (
    <>
      {/* {generating && <View style={{position: "absolute", height: "200%", width: "100%", backgroundColor: "rgba(50, 50, 50, 0.6)", zIndex: 100}}></View>} */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <reactNativePaper.Text style={styles.title}>
            설정
          </reactNativePaper.Text>
        </View>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={styles.profileImage} source={getImage(user.image)} />
            <View style={{ marginLeft: 20 }}>
              <reactNativePaper.Title style={[styles.nameTitle]}>
                {user?.name}
              </reactNativePaper.Title>
              <reactNativePaper.Caption
                style={[styles.caption, { color: '#6A4035' }]}
              >
                {user?.militaryRank}
              </reactNativePaper.Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Feather name="home" color="#6A4035" size={20} />
            <Text
              style={{
                color: 'black',
                marginLeft: 20,
                fontFamily: 'noto-bold',
                width: 80,
              }}
            >
              소속부대
            </Text>
            <Text style={{ color: '#6A4035'}}>
              {user?.affiliatedUnit}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Image
              style={{ width: 20, height: 20, tintColor: '#6A4035' }}
              source={require('../assets/icons/dogtagIcon.png')}
            />
            <Text
              style={{
                color: 'black',
                marginLeft: 20,
                fontFamily: 'noto-bold',
                width: 80,
              }}
            >
              군번
            </Text>
            <Text style={{ color: '#6A4035' }}>
              {user?.serviceNumber}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <AntDesign name="idcard" size={20} color="#6A4035" />
            <Text
              style={{
                color: 'black',
                marginLeft: 20,
                fontFamily: 'noto-bold',
                width: 80,
              }}
            >
              아이디
            </Text>
            <Text style={{ color: '#6A4035' }}>
              {user?.uid}
            </Text>
          </View>
        </View>

        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: '#dddddd',
                borderRightWidth: 1,
              },
            ]}
          >
            <reactNativePaper.Title style={styles.infoBoxText}>
              D{dDay}
            </reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.caption}>
              전역까지
            </reactNativePaper.Caption>
          </View>
          <View style={styles.infoBox}>
            <reactNativePaper.Title style={styles.infoBoxText}>
              {friends ? friends.length : 0}
            </reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.caption}>
              전우
            </reactNativePaper.Caption>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <reactNativePaper.TouchableRipple onPress={handleChangePw}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name="key-change"
                size={24}
                color="#6A4035"
              />
              <Text style={styles.menuItemText}>비밀번호 변경</Text>
            </View>
          </reactNativePaper.TouchableRipple>
          <reactNativePaper.TouchableRipple onPress={handleMyProfile}>
            <View style={styles.menuItem}>
              <AntDesign name="profile" size={24} color="#6A4035" />
              <Text style={styles.menuItemText}>프로필 변경</Text>
            </View>
          </reactNativePaper.TouchableRipple>

          <reactNativePaper.TouchableRipple onPress={generateKeys}>
            <View style={styles.menuItem}>
              <AntDesign name="key" size={24} color="#6A4035" />
              <Text style={styles.menuItemText}>보안키 생성</Text>
            </View>
          </reactNativePaper.TouchableRipple>

          <reactNativePaper.TouchableRipple onPress={handleLogout}>
            <View style={styles.menuItem}>
              <MaterialIcons name="logout" size={24} color="#6A4035" />
              <Text style={styles.menuItemText}>로그아웃</Text>
            </View>
          </reactNativePaper.TouchableRipple>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontFamily: 'noto-bold',
    lineHeight: 45,
  },
  nameTitle: {
    fontSize: 20,
    fontFamily: 'noto-bold',
    lineHeight: 25,
  },
  menucontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5B47F',
    margin: 5,
    paddingLeft: 20,
    borderRadius: 10,
  },
  menuTitle: {
    fontSize: 20,
    fontFamily: 'noto-med',
    color: '#6A4035',
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  caption: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'noto-bold',
    // color: '#6A4035',
    color: '#FFF9D2',
  },
  captionForStatus: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: 'noto-med',
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    flexDirection: 'row',
    height: 100,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  infoBox: {
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'#E5B47F',
    backgroundColor: '#6A4035',
    fontFamily: 'noto-bold',
    borderRadius: 20,
  },
  infoBoxText: {
    fontFamily: 'noto-bold',
    // color: 'white',
    // color: "#6A4035"
    color: '#FFF9D2',
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
    fontFamily: 'noto-bold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 17,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
