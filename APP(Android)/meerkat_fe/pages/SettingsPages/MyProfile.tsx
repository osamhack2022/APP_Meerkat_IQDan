import { StyleSheet,  View, TouchableOpacity, Alert } from "react-native";
import { RootStackScreenProps } from "../../common/types";
import { Ionicons,Feather ,MaterialIcons  } from "@expo/vector-icons";

import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,
  } from 'react-native-paper';

export default function MyProfile(props: RootStackScreenProps<"MyProfile">) {
    const { navigation } = props;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="chevron-back"
                        size={24}
                        color="black"
                    />
                    나의 프로필
                </Text>
            </View>
            <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {/* <Avatar.Image 
            source={{
              uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
            }}
            size={80}
          /> */}
          {/* <Feather
                        onPress={() => navigation.goBack()}
                        name="user"
                        size={80}
                        color="black"
                    /> */}
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>임동진</Title>
            <Caption style={styles.caption}>일병</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Feather name="home" color="#black" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>계룡대근무지원단</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons  name="confirmation-number" color="#black" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>22-76014363</Text>
        </View>
        <View style={styles.row}>
        <MaterialIcons name="date-range" size={20} color="black" />
          <Text style={{color:"#777777", marginLeft: 20}}>2022-09-24</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>D-100</Title>
            <Caption>전역까지</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>12</Title>
            <Caption>친구</Caption>
          </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
          <Feather name="home" color="#black" size={25}/>
            <Text style={styles.menuItemText}>비밀번호 변경</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={()=>{}}>
          <View style={styles.menuItem}>
          <Feather name="home" color="#black" size={25}/>
            <Text style={styles.menuItemText}>프로필 변경</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
          <Feather name="home" color="#black" size={25}/>
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
        paddingBottom: 10,
    },
    userInfoSection: {
      paddingHorizontal: 30,
      marginBottom: 25,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuWrapper: {
      marginTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    menuItemText: {
      color: 'black',
      marginLeft: 20,
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
  });
