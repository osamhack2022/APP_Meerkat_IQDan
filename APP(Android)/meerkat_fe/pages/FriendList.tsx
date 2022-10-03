// core
import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
// comp
import MyBox from "../components/FriendList/MyBox"
import CategoryBox from "../components/FriendList/CategoryBox"
import FriendBox from "../components/FriendList/FriendBox"
import Header from "../components/Header";
// type
import { MainTabScreenProps, User, UserEvent } from "../common/types.d";
import EventFriendBox from "../components/FriendList/EventFriendBox";

export default function FriendList(props: MainTabScreenProps<"Friends">) {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
    fetchFromAsyncStorage()
    // setdata
    fetchFromServer()
    // setdata
    
    /*
      1. 둘다 로딩되지 않은 경우 -> 로딩창 띄워줌
      2. async만 로딩된 경우 -> 그거 띄워줌
          이후 server 로딩 완료된 경우 -> 그거 띄워줌
      3. server만 로딩된 경우 -> 그거 띄워주고 async에 넣음
    */
  }, []);


  const fetchFromAsyncStorage = async () => {
  
  }

  const fetchFromServer = async () => {
      // axios get 후에 async storage set
  }

  return (
    <View style={styles.mainContainer}>
      <Header categoryName="전우 목록"/>
      <ScrollView>
        <MyBox
          name={"나"}
          statusMessage={"나의 메시지"}
        />

        <CategoryBox categoryName={"곧 전역인 전우들"} event={UserEvent.RESERVE} />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator = {false} style={styles.eventContainer}>
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
        </ScrollView>

        <CategoryBox categoryName={"곧 진급인 전우들"} event={UserEvent.PROMOTION}/>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator = {false} style={styles.eventContainer}>
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
          <EventFriendBox
            name={"이벤트이벤트이벤트이벤트".substr(0, 4) + "..."}
          />
        </ScrollView>

        <CategoryBox categoryName={"전우들"} />
        <FriendBox
          name={"테스터33"}
          image={require('../assets/users/promotion.jpg')}
          
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터4"}
          statusMessage={"상태메시지4"}
        />
        <FriendBox
          name={"테스터5"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터6"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터7"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터8"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터9"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터10"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터11"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터12"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터13"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터14"}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터15"}
          statusMessage={"상태메시지3"}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer:{
      backgroundColor: "white"
  },
  eventContainer:{
    marginLeft: 17,
    height: 75,
  }
})