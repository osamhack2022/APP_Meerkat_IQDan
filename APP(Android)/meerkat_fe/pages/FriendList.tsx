// core
import { useState } from "react";
import { StyleSheet, View } from "react-native";
// comp
import MyBox from "../components/FriendList/MyBox"
import CategoryBox from "../components/FriendList/CategoryBox"
import FriendBox from "../components/FriendList/FriendBox"
import Header from "../components/Header";
// type
import { User, UserEvent } from "../common/types.d";
// routing
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { ScrollView } from "react-native-gesture-handler";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Friend">;

export default function ChatRoomList(props: HomeScreenProps) {
  const [users, setUsers] = useState<User[] | null>(null);

  //routing

  return (
    <View style={styles.mainContainer}>
      <Header categoryName="전우 목록"/>
      <ScrollView>
        <MyBox
          name={"나"}
          statusMessage={"나의 메시지"}
        />

        <CategoryBox categoryName={"곧 전역인 전우들"} />
        <FriendBox
          name={"테스터1"}
          event={UserEvent.RESERVE}
          statusMessage={"상태메시지1"}
        />
        <FriendBox
          name={"테스터2"}
          event={UserEvent.RESERVE}
          statusMessage={"상태메시지2"}
        />

        <CategoryBox categoryName={"곧 진급인 전우들"} />
        <FriendBox
          name={"테스터3"}
          event={UserEvent.PROMOTION}
          statusMessage={"상태메시지3"}
        />
        <FriendBox
          name={"테스터4"}
          event={UserEvent.PROMOTION}
          statusMessage={""}
        />
        <FriendBox
          name={"테스터5"}
          event={UserEvent.PROMOTION}
          statusMessage={"상태메시지상태메시지상태메시지상태메시지상태메시지상태메시지5".substring(0, 10) + "..."}
        />

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
  }
})