// core
import { useEffect, useState, useRef } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
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
import {DeviceEventEmitter} from "react-native"

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
          <EventFriendBox key={user.uid} name={`${user.name}`} image={user.image}/>
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
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      await sleep(0.7);
      await fetchFromAsyncStorage();
      // await sleep(2);
      fetchFriends();

    })();
    
    (async () => {
      fetchMe(); 
    })();
    
    DeviceEventEmitter.addListener("fetchFriends", (eventData) => {
      fetchFriends();
    });

    return () => {
      DeviceEventEmitter.removeAllListeners("fetchFriends");
    }
  }, []);

  const fetchFromAsyncStorage = async () => {
    let friends = JSON.parse(await AsyncStorage.getItem(FriendListKey) || "[]")
    setPageState("loaded");
    setFriends(friends);
  };

  const fetchMe = async () => {
    api
      .get("/users/me")
      .then((res) => {
        let data = res.data.data;
        setUser(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

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

  const FriendListPage=()=>{
    if (friends.length == 0) {
      return <Text style={{color: "#555", alignSelf: "center", margin: 4}}>해당하는 전우가 없습니다.</Text>
    }
  
    return (
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
    )
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

  if (user === null) return <></>
  return (
    <View style={{backgroundColor: "white", width: "100%", height: "100%"}}>
      
      <UserProfilePanel 
        user={currentProfileUser}
        setUser={setCurrentProfileUser}
        onClose={() => setCurrentProfileUser(null)}
        gotoChat={() => {}}
        onDeleteFriend={() => {setCurrentProfileUser(null); fetchFriends()}}
      />
      <View style={styles.mainContainer}>
        <Header categoryName="전우 목록" onPressAddFriend={() => navigation.push("AddFriend")} />
        <ScrollView>
          <MyBox name={`${user.militaryRank} ${user.name}`} statusMessage={user.affiliatedUnit} image={user.image} />

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
              FriendListPage()
            }
            
          </View>
          <View style={{ paddingBottom: 120, backgroundColor: "white" }} />
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
