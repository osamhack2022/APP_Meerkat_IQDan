// core
import { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// comp
import MyBox from '../components/FriendList/MyBox';
import MyBoxLoading from '../components/FriendList/MyBoxLoading';
import CategoryBox from '../components/FriendList/CategoryBox';
import CategoryBoxLoading from '../components/FriendList/CategoryBoxLoading';
import FriendBox from '../components/FriendList/FriendBox';
import FriendBoxLoading from '../components/FriendList/FriendBoxLoading';
import EventFriendBox from '../components/FriendList/EventFriendBox';
import EventFriendBoxLoading from '../components/FriendList/EventFriendBoxLoading';
import Header from '../components/FriendList/Header';
// type
import { MainTabScreenProps, User, UserEvent } from '../common/types.d';

import axios from 'axios';
import getGlitterStyle from '../components/FriendList/getGlitterStyle';
import FriendListLoading from '../components/FriendList/FriendListLoading';

export default function FriendList(props: MainTabScreenProps<'Friends'>) {
  const [users, setUsers] = useState<User[] | null>(null);

  const glitterAnimationValue = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
    fetchFromAsyncStorage();
    // setdata
    fetchFromServer();
    // setdata
    // TODO : 친구 이름 [계급 + 이름]으로 변경
    // TODO: 친구 정보 받아오기, 못 받아오면 Loading component 띄워주기
    // TODO: 목록 꾹 누르면 그 사용자 친구삭제 띄워주기
    // TODO: header + 누르면 친구 추가 창 뜨게 하기(사용자이름, 군번 입력, 검색 -> 그 사용자 프로필 띄움 + 그 사용자 프로필 띄움.)

    /*
      1. 둘다 로딩되지 않은 경우 -> 로딩창 띄워줌
      2. async만 로딩된 경우 -> 그거 띄워줌
          이후 server 로딩 완료된 경우 -> 그거 띄워줌
      3. server만 로딩된 경우 -> 그거 띄워주고 async에 넣음
    */
  }, []);

  const fetchFromAsyncStorage = async () => {
    //await AsyncStorage.getItem("friendList")
    //await AsyncStorage.setItem("friendList", cookies[0].value)
  };

  const fetchFromServer = async () => {
    // axios get 후에 async storage set
    // async storge에 넣고, async에서 받아오고, 그걸 리턴하면 ?
    /*console.log("token : " + userToken);
        axios
            .get("https://code.seholee.com:8082/friends", {
                headers: {
                    Authorization: "Bearer " + userToken,
                },
            })
            .then(async (res) => {
                console.log(res);
            })
            .catch((err) => {
                // TODO : show error
                console.log(err.response);
            });*/
  };

  if (true) {return <FriendListLoading />}
  return (
    <>
      <View style={styles.mainContainer}>
        <Header categoryName="전우 목록" />
        <ScrollView>
          <MyBox name={'나'} statusMessage={'나의 메시지'} />

          <CategoryBox
            categoryName={'곧 전역인 전우들'}
            event={UserEvent.RESERVE}
          />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.eventContainer}
          >
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
          </ScrollView>

          <CategoryBox
            categoryName={'곧 진급인 전우들'}
            event={UserEvent.PROMOTION}
          />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.eventContainer}
          >
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
            <EventFriendBox
              name={'이벤트이벤트이벤트이벤트'.substr(0, 4) + '...'}
            />
          </ScrollView>

          <CategoryBox categoryName={'전우들'} />
          <FriendBox
            name={'테스터33'}
            image={require('../assets/users/promotion.jpg')}
            statusMessage={'상태메시지3'}
          />
          <FriendBox name={'테스터4'} statusMessage={'상태메시지4'} />
          <FriendBox name={'테스터5'} statusMessage={'상태메시지3'} />
          <FriendBox name={'테스터6'} statusMessage={'상태메시지3'} />
          <FriendBox
            name={'테스터7'}
            statusMessage={'상태메시지3'}
            dday={100}
          />
          <FriendBox name={'테스터8'} statusMessage={''} />
          <FriendBox name={'테스터9'} />
          <FriendBox
            name={'테스터10'}
            statusMessage={'상태메시지3'}
            dday={150}
          />
          <FriendBox name={'테스터11'} statusMessage={'상태메시지3'} />
          <FriendBox name={'테스터12'} statusMessage={'상태메시지3'} />
          <FriendBox name={'테스터13'} statusMessage={'상태메시지3'} />
          <FriendBox name={'테스터14'} statusMessage={'상태메시지3'} />
          <FriendBox name={'테스터15'} statusMessage={'상태메시지3'} />
        </ScrollView>
      </View>
    </>
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
});
