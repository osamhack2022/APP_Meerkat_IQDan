// core
import { useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import {
    MaterialCommunityIcons,
    Feather,
    MaterialIcons,
    AntDesign
} from "@expo/vector-icons";
import * as reactNativePaper from 'react-native-paper';

// thirds
import AsyncStorage from "@react-native-async-storage/async-storage";
// types
import { MainTabScreenProps } from "../common/types";
// context
import { LoginContext } from "../common/Context";

export default function Settings(props: MainTabScreenProps<"Settings">) {
    const {navigation} = props;
    const { checkIfLoggedIn } = useContext(LoginContext);


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
                <reactNativePaper.Text style={styles.title}>설정</reactNativePaper.Text>
            </View>
            <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {/* <Avatar.Image 
            source={{
              uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
            }}
            size={80}
          /> */}
          <Feather
                        onPress={() => navigation.goBack()}
                        name="user"
                        size={80}
                        color="black"
                    />
          <View style={{marginLeft: 20}}>
            <reactNativePaper.Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>임동진</reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.caption}>일병</reactNativePaper.Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Feather name="home" color="#black" size={20}/>
          <reactNativePaper.Text style={{color:"black", marginLeft: 20}}>소속부대</reactNativePaper.Text>
          <reactNativePaper.Text style={{color:"#777777", marginLeft: 20}}>계룡대근무지원단</reactNativePaper.Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons  name="confirmation-number" color="#black" size={20}/>
          <reactNativePaper.Text style={{color:"black", marginLeft: 20}}>군번</reactNativePaper.Text>
          <reactNativePaper.Text style={{color:"#777777", marginLeft: 20}}>22-76014363</reactNativePaper.Text>
        </View>
        <View style={styles.row}>
        <AntDesign name="idcard" size={20} color="black" />
        <reactNativePaper.Text style={{color:"black", marginLeft: 20}}>아이디</reactNativePaper.Text>
          <reactNativePaper.Text style={{color:"#777777", marginLeft: 20}}>test</reactNativePaper.Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <reactNativePaper.Title style={styles.infoBoxText}>D-100</reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.caption}>전역까지</reactNativePaper.Caption>
          </View>
          <View style={styles.infoBox}>
            <reactNativePaper.Title style={styles.infoBoxText}>12</reactNativePaper.Title>
            <reactNativePaper.Caption style={styles.caption}>친구</reactNativePaper.Caption>
          </View>
      </View>

      <View style={styles.menuWrapper}>
        <reactNativePaper.TouchableRipple onPress={handleChangePw}>
          <View style={styles.menuItem}>
          <MaterialCommunityIcons name="key-change" size={24} color="black" />
            <reactNativePaper.Text style={styles.menuItemText}>비밀번호 변경</reactNativePaper.Text>
          </View>
        </reactNativePaper.TouchableRipple>
        <reactNativePaper.TouchableRipple onPress={handleMyProfile}>
          <View style={styles.menuItem}>
          <AntDesign name="profile" size={24} color="black" />
            <reactNativePaper.Text style={styles.menuItemText}>프로필 변경</reactNativePaper.Text>
          </View>
        </reactNativePaper.TouchableRipple>
        <reactNativePaper.TouchableRipple onPress={handleLogout}>
          <View style={styles.menuItem}>
          <MaterialIcons name="logout" size={24} color="black" />
            <reactNativePaper.Text style={styles.menuItemText}>로그아웃</reactNativePaper.Text>
          </View>
        </reactNativePaper.TouchableRipple>
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
});
