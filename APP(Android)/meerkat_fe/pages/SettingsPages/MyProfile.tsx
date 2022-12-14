import { StyleSheet,  View, TouchableOpacity, Alert, Text, TextInput, Button } from "react-native";
import { RootStackScreenProps, User } from "../../common/types";
import { Ionicons, Feather, MaterialIcons, AntDesign, MaterialCommunityIcons  } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEffect, useState } from "react";

import api from "../../common/api";

export default function MyProfile(props: RootStackScreenProps<"MyProfile">) {
    const { navigation } = props;
    const [errMsg, setErrMsg] = useState("");
    const [name, setName] = useState("");
    const [enlistmentDate, setEnlistmentDate] = useState("");
    const [affiliatedUnit, setAffiliatedUnit] = useState("");
    const [militaryRank, setMilitaryRank] = useState("");
    const [user, setUser] = useState<User|null>(null);
    const [apiResult,setApiResult]=useState({status:false,msg:""});

    useEffect(() => {
        // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
        (async () => {
          fetchMe(); 
        })();

        if (apiResult.status){
            setErrMsg(apiResult.msg);
        }
    

           }, [apiResult]);

    const fetchMe = async () => {
        api
          .get("/users/me")
          .then((res) => {
            let data = res.data.data as User;
            setUser(data);
            setAffiliatedUnit(data.affiliatedUnit);
            setEnlistmentDate(data.enlistmentDate.substring(0,10));
            setMilitaryRank(data.militaryRank);
            setName(data.name);
            
          })
          .catch((err) => {
            console.log(err);
          })
      }

    const handleChangeProfile = async () => {
      if (!isEnlistmentDateValid()) {
        let errText="입대일을 2000-01-01 형식으로 적어주세요."
        setApiResult({status:true, msg:errText});
          return Alert.alert(
              ":/",
              "입대일을 2000-01-01 형식으로 적어주세요.",
              [
                  {
                      text: "확인",
                      onPress: () => {},
                  },
              ]
          );
      }


      return await api
          .put("/users/updateUserInfo", {
              name: name,
              enlistmentDate: enlistmentDate + "T00:00:00.000Z",
              affiliatedUnit: affiliatedUnit,
              militaryRank: militaryRank,
          })
          .then(async (res) => {
            //navigation.goBack();
            return Alert.alert("프로필변경", "프로필변경이 완료되었습니다.", [
                  {
                      text: "확인",
                      onPress: () => navigation.goBack(),
                  },
              ]);
          })
          .catch((err) => {
              let errText = "알 수 없는 이유로 프로필변경에 실패하였습니다.";
              setApiResult({status:true, msg:errText});
              return Alert.alert(":(", errText, [
                  {
                      text: "확인",
                      onPress: () => navigation.goBack(),
                  },
              ]);
          });
  };

  const isEnlistmentDateValid = () => {
    const regex = RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
    if (regex.test(enlistmentDate)) {
        return true;
    } else {
        return false;
    }
};
    
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
                    프로필 변경
                </Text>
            </View>
            <View style={styles.innerContainer}>
                <Text style={styles.errMsg}>{errMsg}</Text>
                <Text style={styles.text}>입대일</Text>
                <TextInput
                    onChangeText={setEnlistmentDate}
                    value={enlistmentDate}
                    style={styles.textBox}
                    placeholder="2022-01-01"
                />
                <Text style={styles.text}>소속</Text>
                <TextInput
                    onChangeText={setAffiliatedUnit}
                    value={affiliatedUnit}
                    style={styles.textBox}
                />
                <Text style={styles.text}>계급</Text>
                <TextInput
                    onChangeText={setMilitaryRank}
                    value={militaryRank}
                    style={styles.textBox}
                />
            </View>
            <Button onPress={handleChangeProfile} title="변경하기" color="#6A4035" />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#fff",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
    },
    title: {
      fontSize: 25,
      fontFamily: "noto-bold",
      lineHeight: 45,
  },
    innerContainer: {
      marginBottom: 10,
  },
  pressableContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
  },
  text: {
      fontSize: 12,
      lineHeight: 15,
      fontFamily: "noto-bold",
  },
  errMsg: {
      color: "red",
      fontFamily: "noto-med",
      textAlign: "center",
  },
  textBox: {
      fontSize: 12,
      lineHeight: 20,
      width: 250,
      borderBottomWidth: 1,
      borderColor: "black",
      marginBottom: 20,
      fontFamily: "noto-med",
  },
  pressableText: {
      color: "#E5B47F",
      fontFamily: "noto-bold",
  },
  subText: {
      fontFamily: "noto-med",
  },
  row: {
      flexDirection: "row",
  },
  });
