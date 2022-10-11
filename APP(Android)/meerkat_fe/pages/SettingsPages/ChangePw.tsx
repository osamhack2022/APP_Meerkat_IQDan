import { StyleSheet, Text, View, TextInput, Alert, Button } from "react-native";
import { RootStackScreenProps } from "../../common/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import api from "../../common/api";

export default function ChangePw(props: RootStackScreenProps<"ChangePw">) {
    const { navigation } = props;
    const [errMsg, setErrMsg] = useState("");
    const [currentPw, setCurrentPw] = useState("");
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    const [apiResult,setApiResult]=useState({status:false,msg:""});

    useEffect(() => {
        if (pwCheck === "") return;
        if (pw !== pwCheck) {
            setErrMsg("비밀번호가 일치하지 않습니다.");
        } else {
            setErrMsg("");
        }
        if (apiResult.status){
            setErrMsg(apiResult.msg);
        }
    }, [pw, pwCheck, apiResult]);

    const handleChangePassword = () => {
        api
            .put("/users/updateUserPw", {
            currentPassword: currentPw,   
            password: pw,
            })
            .then(async (res) => {
                Alert.alert("비밀번호변경 완료", "비밀번호 변경이 완료되었습니다.", [
                    {
                        text: "확인",
                        onPress: () => navigation.goBack(),
                    },
                ]);
                //navigation.goBack();
            })
            .catch((err) => {
                let errText = "알 수 없는 이유로 비밀번호 변경에 실패하였습니다.";
                console.log(err);
                if (err.response.status === 409) {
                    if (err.response.message === "Password is not matching") {
                        errText = "현재 비밀번호가 일치하지않습니다";
                    } 
                }
                Alert.alert(":(", errText, [
                    {
                        text: "확인",
                        onPress: () => {},
                    },
                ]);
                setApiResult({status:true, msg:errText});
            });
            
            
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
                    />비밀번호 변경</Text>    
               </View>
               <Text style={styles.errMsg}>{errMsg}</Text>
               <Text style={styles.text}>현재 비밀번호</Text>
                <TextInput
                    onChangeText={setCurrentPw}
                    value={currentPw}
                    style={styles.textBox}
                    secureTextEntry={true}
                />
               <Text style={styles.text}>변경할 비밀번호</Text>
                <TextInput
                    onChangeText={setPw}
                    value={pw}
                    style={styles.textBox}
                    secureTextEntry={true}
                />
                <Text style={styles.text}>비밀번호 확인</Text>
                <TextInput
                    onChangeText={setPwCheck}
                    value={pwCheck}
                    style={styles.textBox}
                    secureTextEntry={true}
                />
               <Button onPress={handleChangePassword} title="변경하기" color="#6A4035" />
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
    innerContainer: {
        marginBottom: 10,
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
    text: {
        fontSize: 12,
        lineHeight: 15,
        fontFamily: "noto-bold",
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
    row: {
        flexDirection: "row",
    },
    errMsg: {
        color: "red",
        fontFamily: "noto-med",
        textAlign: "center",
    },
});
