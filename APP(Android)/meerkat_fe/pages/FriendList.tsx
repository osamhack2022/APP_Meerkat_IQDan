// core
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
// comp
import CategoryBox from "../components/FriendList/CategoryBox"
import FriendBox from "../components/FriendList/FriendBox"
import Searchbar from "../components/ChatRoomList/Searchbar";
import Header from "../components/Header";
// type
import { User, UserEvent } from "../common/types.d";
// dummy data
import dummy from "../assets/dummy_data/chatroom.json";
// routing
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";



type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Friend">;

export default function ChatRoomList(props: HomeScreenProps) {
  const [users, setUsers] = useState<User[] | null>(null);

  //routing

  return (
    <View>
      <Header categoryName="전우 목록"/>
      <CategoryBox categoryName={"곧 전역인 전우들"} />
       <FriendBox
        key={1}
        name={"테스터1"}
        image={null}
        event={UserEvent.RESERVE}
        statusMessage={"상태메시지1"}
       />
       <FriendBox
        key={2}
        name={"테스터2"}
        image={null}
        event={UserEvent.RESERVE}
        statusMessage={"상태메시지2"}
       />

      <CategoryBox categoryName={"곧 진급인 전우들"} />
      <FriendBox
        key={3}
        name={"테스터3"}
        image={null}
        event={UserEvent.PROMOTION}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={4}
        name={"테스터4"}
        image={null}
        event={UserEvent.PROMOTION}
        statusMessage={""}
       />
       <FriendBox
        key={5}
        name={"테스터5"}
        image={null}
        event={UserEvent.PROMOTION}
        statusMessage={"상태메시지상태메시지상태메시지상태메시지상태메시지상태메시지5".substring(0, 10) + "..."}
       />

      <CategoryBox categoryName={"전우들"} />
      <FriendBox
        key={6}
        name={"테스터3"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={7}
        name={"테스터4"}
        image={null}
        event={null}
        statusMessage={"상태메시지4"}
       />
       <FriendBox
        key={8}
        name={"테스터5"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={1}
        name={"테스터6"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={9}
        name={"테스터7"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={10}
        name={"테스터8"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={11}
        name={"테스터9"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={12}
        name={"테스터10"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={13}
        name={"테스터11"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={14}
        name={"테스터12"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={15}
        name={"테스터13"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={16}
        name={"테스터14"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       <FriendBox
        key={17}
        name={"테스터15"}
        image={null}
        event={null}
        statusMessage={"상태메시지3"}
       />
       
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 25,
    fontFamily: "noto-bold",
    lineHeight: 45
  },
});
