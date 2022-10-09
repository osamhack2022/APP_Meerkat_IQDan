// core
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Alert, Image } from "react-native";
import {
    MaterialCommunityIcons,
    Feather,
    MaterialIcons,
    AntDesign
} from "@expo/vector-icons";
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
    Colors,
  } from 'react-native-paper';

// thirds
import AsyncStorage from "@react-native-async-storage/async-storage";
// types
import { MainTabScreenProps, User } from "../common/types";
// context
import { LoginContext } from "../common/Context";
import api from "../common/api";

import getProfileSource from "../components/FriendList/getProfileSource";
import { useIsFocused } from "@react-navigation/native";

const FriendListKey = "FriendList";

export default function Settings(props: MainTabScreenProps<"Settings">) {
    const {navigation} = props;
    const { checkIfLoggedIn } = useContext(LoginContext);
    const [user, setUser] = useState<User|null>(null);
    const [dDay, setDDday] = useState(0);
    const [pageState, setPageState] = useState<string>("loading");
    const [friends, setFriends] = useState<User[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
      // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
      if(isFocused){
      (async () => {
        await sleep(0.7);
        await fetchFromAsyncStorage();
        // await sleep(2);
        fetchFriends();
  
      })();
      (async () => {
        fetchMe(); 
      })();}
         }, [isFocused]);

  const fetchMe = async () => {
      api
        .get("/users/me")
        .then((res) => {
          let data = res.data.data as User;
          setUser(data);
          setDDday(computedDday(data.enlistmentDate));
    
          
        })
        .catch((err) => {
          console.log(err);
        })
    }
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
    
  const sleep = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve("slept well"), time*1000)
    });
};
  const computedDday=(enlistmentDate:any)=>{
  const currentDate= new Date();
  const enlistmentDateToDate= new Date(enlistmentDate);

  const diffDate = currentDate.getTime() - enlistmentDateToDate.getTime();
  return Math.floor(Math.abs(diffDate / (1000 * 60 * 60 * 24))); 
  };

    const handleMyProfile = () => {
        navigation.navigate("MyProfile")
    }

    const handleChangePw = () => {
        navigation.navigate("ChangePw")
    }


    const handleRemoveUser = () => {
        Alert.alert(
            ":/",
            "현재 지원되지 않는 기능입니다.",
            [
                {
                    text: "확인",
                    onPress: () => {},
                },
            ]
        );
    }


    const handleLogout = async () => {
        await AsyncStorage.setItem("userToken", "");
        await AsyncStorage.setItem("userTokenExpiration", "");
        checkIfLoggedIn();
        navigation.navigate("Auth")
    };


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>설정</Text>
            </View>
            <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Image style={styles.profileImage}
            source={getProfileSource(user?.image)}
          />
         
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{user?.name}</Title>
            <Caption style={styles.caption}>{user?.militaryRank}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Feather name="home" color="#6A4035" size={20}/>
          <Text style={{color:"black", marginLeft: 20,fontFamily: "noto-bold",}}>소속부대</Text>
          <Text style={{color:"#6A4035", marginLeft: 20}}>{user?.affiliatedUnit}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons  name="confirmation-number" color="#6A4035" size={20}/>
          <Text style={{color:"black", marginLeft: 20,fontFamily: "noto-bold",}}>군번</Text>
          <Text style={{color:"#6A4035", marginLeft: 20}}>{user?.serviceNumber}</Text>
        </View>
        <View style={styles.row}>
        <AntDesign name="idcard" size={20} color="#6A4035" />
        <Text style={{color:"black", marginLeft: 20,fontFamily: "noto-bold",}}>아이디</Text>
          <Text style={{color:"#6A4035", marginLeft: 20}}>{user?.uid}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title style={styles.infoBoxText}>D-{dDay}</Title>
            <Caption style={styles.caption}>전역까지</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title style={styles.infoBoxText}>{friends.length}</Title>
            <Caption style={styles.caption}>친구</Caption>
          </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={handleChangePw}>
          <View style={styles.menuItem}>
          <MaterialCommunityIcons name="key-change" size={24} color="#6A4035" />
            <Text style={styles.menuItemText}>비밀번호 변경</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={handleMyProfile}>
          <View style={styles.menuItem}>
          <AntDesign name="profile" size={24} color="#6A4035" />
            <Text style={styles.menuItemText}>프로필 변경</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={handleLogout}>
          <View style={styles.menuItem}>
          <MaterialIcons name="logout" size={24} color="#6A4035" />
            <Text style={styles.menuItemText}>로그아웃</Text>
          </View>
        </TouchableRipple>
      </View>
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
        justifyContent: "space-between",
        paddingBottom: 10
    },
    title: {
        fontSize: 25,
        fontFamily: "noto-bold",
        lineHeight: 45,
    },
    menucontainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E5B47F",
        margin: 5,
        paddingLeft: 20,
        borderRadius: 10,
    },
    menuTitle: {
        fontSize: 20,
        fontFamily: "noto-med",
        color: "#6A4035",
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 25,
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
      fontFamily: "noto-bold",
      color: '#6A4035',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    column: {
        flexDirection: 'column',
        marginBottom: 10,
      }
    ,
    infoBoxWrapper: {
      flexDirection: 'row',
      height: 100,
      borderRadius: 20,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#E5B47F',
      fontFamily: "noto-bold",
      borderRadius: 20,
      margin:2
    },
    infoBoxText:{
      fontFamily: "noto-bold",
      color: 'white',
      marginBottom: 5
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
      fontFamily: "noto-bold",
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 17,
    },
});
