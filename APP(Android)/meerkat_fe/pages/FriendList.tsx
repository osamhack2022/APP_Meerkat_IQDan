// core
import { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, View, ScrollView, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// comp
import MyBox from '../components/FriendList/MyBox';
import CategoryBox from '../components/FriendList/CategoryBox';
import FriendBox from '../components/FriendList/FriendBox';
import EventFriendBox from '../components/FriendList/EventFriendBox';
import Header from '../components/FriendList/Header';
import UserProfilePanel from '../components/FriendList/UserProfilePanel';
// type
import { MainTabScreenProps, User, UserEvent } from '../common/types.d';

import FriendListLoading from '../components/FriendList/FriendListLoading';
import api from '../common/api';

const FriendListKey = "FriendList";

const getReserveDate = (d: Date) => {
  let r = new Date(d);
  r.setMonth(r.getMonth() + 18);
  return r;
}

const getDiff = (d1:Date, d2: Date) => {
  return Math.ceil((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
}

const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("slept well"), time*1000)
  })
}

const EventFriendList = (props: {users: User[]}) => {
  if (props.users.length == 0) {
    return <Text style={{color: "#555", alignSelf: "center", margin: 4}}>해당하는 전우가 없습니다.</Text>
  }

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.eventContainer}
    >
      {
        props.users.map((user) => 
          <EventFriendBox key={user.uid} name={`${user.militaryRank} ${user.name}`}/>
        )
      }
    </ScrollView>
  )
}

export default function FriendList(props: MainTabScreenProps<'Friends'>) {
  const { navigation } = props;  

  const [pageState, setPageState] = useState<string>("loading");
  const [currentProfileUser, setCurrentProfileUser] = useState<User|null>(null);
  const [user, setUser] = useState<User|null>(null);
  const [friends, setFriends] = useState<User[] | null>(null);

  useEffect(() => {
    // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.

    (async () => {
      await sleep(0.7);
      await fetchFromAsyncStorage();
      // await sleep(2);
      fetchFriends();

    })();
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
    let friends = JSON.parse(await AsyncStorage.getItem(FriendListKey) || "[]")
    setPageState("loaded");
    setFriends(friends);
  };

  const fetchFriends = async () => {
    // axios get 후에 async storage set
    // async storge에 넣고, async에서 받아오고, 그걸 리턴하면 ?

    let userToken = await AsyncStorage.getItem("userToken")

    api.get("/friends", {
        headers: {
          Authorization: "Bearer " + userToken,
        },
      })
      .then(async (res) => {
        let friends = res.data.data;
        setFriends(friends);
        setPageState("loaded");
        AsyncStorage.setItem(FriendListKey, JSON.stringify(friends));
      })
      .catch((err) => {
        // TODO : show error
        setPageState("error");
        console.log(err.response);
      })
  };

  if (pageState == "loading") {return <FriendListLoading />}
  else if (pageState == "error") {return <View><Text>Error!!!!</Text></View>}

  const now = new Date();

  const reserveUsers = friends?.filter((user) => {
    let d = new Date(user.enlistmentDate);
    let diff = getDiff(getReserveDate(d), now);
    return 0 <= diff && diff <= 50;
  }) || [];

  const promotionUsers = friends?.filter((user) => {
    let d = new Date(user.enlistmentDate);
    let diff = getDiff(getReserveDate(d), now);
    return (100 <= diff && diff <= 120) ||
      (280 <= diff && diff <= 310) ||
      (480 <= diff && diff <= 500);
  }) || [];

  return (
    <View style={{backgroundColor: "pink", width: "100%", height: "100%"}}>
      <UserProfilePanel 
        user={currentProfileUser}
        setUser={setCurrentProfileUser}
        onClose={() => setCurrentProfileUser(null)}
        gotoChat={() => navigation.push("Chat")}
      />
      <View style={styles.mainContainer}>
        <Header categoryName="전우 목록" />
        <ScrollView>
          <MyBox name={`나`} statusMessage={'나의 메시지'} />

          <CategoryBox
            categoryName={'곧 전역인 전우들'}
            event={UserEvent.RESERVE}
          />
          <EventFriendList users={reserveUsers}/>

          <CategoryBox
            categoryName={'곧 진급인 전우들'}
            event={UserEvent.PROMOTION}
          />
          <EventFriendList users={promotionUsers}/>

          <CategoryBox categoryName={'전우들'} />
          <View>
            {
              friends?.map((user) => {
                let endDate = (new Date(user.enlistmentDate));
                return (
                  <FriendBox
                    key={user.uid}
                    name={`${user.militaryRank} ${user.name}`}  
                    statusMessage={user.affiliatedUnit}
                    image={user.image}
                    dday={getDiff(getReserveDate(endDate), now)}
                    onPress={() => setCurrentProfileUser(user)}
                  />)
              })
            }
            <FriendBox
              name={'테스터33'}
              image={require('../assets/users/promotion.jpg')}
              statusMessage={'상태메시지3'}
            />
            <FriendBox name={'테스터4'} statusMessage={'상태메시지4'} />
            <FriendBox name={'테스터5'} statusMessage={'상태메시지3'} />
            <FriendBox name={'테스터6'} statusMessage={'상태메시지3'} />
            <FriendBox name={'테스터7'} statusMessage={'상태메시지3'} dday={100} />
            <FriendBox name={'테스터8'} statusMessage={''} />
            <FriendBox name={'테스터9'} />
            <FriendBox name={'테스터10'} statusMessage={'상태메시지3'} dday={150} />
            <FriendBox name={'테스터11'} statusMessage={'상태메시지3'} />
            <FriendBox name={'테스터12'} statusMessage={'상태메시지3'} />
            <FriendBox name={'테스터13'} statusMessage={'상태메시지3'} />
            <FriendBox name={'테스터14'} statusMessage={'상태메시지3'} />
            <FriendBox name={'테스터15'} statusMessage={'상태메시지3'} />
          </View>
          <View style={{ paddingBottom: 120, backgroundColor: "pink" }} />
        </ScrollView>
      </View>
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
});
