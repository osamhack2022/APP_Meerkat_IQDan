// core
import { useState } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Image,
    Button,
    Pressable,
} from "react-native";
// thirds
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import env from "../env.json";

export default function Login(props: {setCurrPage: Function, checkIfLoggedIn: Function}) {
    const {setCurrPage, checkIfLoggedIn} = props
    const [id, setId] = useState("")
    const [pw, setPw] = useState("")
    const [errMsg, setErrMsg] = useState("")
    
    const handleLogin = () => {
        axios.post(env.dev.apiBaseUrl + "/auth/login", {
            uid: id,
            password: pw
        }).then(async (res) =>{
            // set token and expiry date. then, refresh token check
            if (res.data.data.token === undefined) throw new Error;
            await AsyncStorage.setItem("userToken", res.data.data.token)
            if (res.data.data.expiresIn === undefined) throw new Error;
            const expiry = Date.now() + res.data.data.expiresIn*1000 // save as milliseconds
            await AsyncStorage.setItem("userTokenExpiration", expiry.toString())
            checkIfLoggedIn();
        }).catch((err)=> {
            if (err.response === undefined) {
                return setErrMsg("알 수 없는 오류가 발생했습니다.")
            }
            // show error message
            if (err.response.status === 409) {
                setErrMsg("아이디 또는 비밀번호가 잘못되었습니다.")
            } else {
                setErrMsg("알 수 없는 오류가 발생했습니다.")
            }
        })
    };

    const handleRegister = () => {
        setCurrPage("register")
    };

    const handleForgotPw = () => {
        setCurrPage("changePw")
    };

    return (
        <>
            <View style={styles.innerContainer}>
                <Text style={styles.errMsg}>{errMsg}</Text>
                <Text style={styles.text}>아이디</Text>
                <TextInput
                    onChangeText={setId}
                    value={id}
                    style={styles.textBox}
                />
                <Text style={styles.text}>비밀번호</Text>
                <TextInput
                    onChangeText={setPw}
                    value={pw}
                    style={styles.textBox}
                    secureTextEntry={true}
                />
            </View>
            <Button
                onPress={handleLogin}
                title="로그인"
                color="#6A4035"
                accessibilityLabel="Learn more about this purple button"
            />
            <View style={styles.pressableContainer}>
                <Text style={styles.subText}>또는 </Text>
                <Pressable onPress={handleRegister}>
                    <Text style={styles.pressableText}>회원가입</Text>
                </Pressable>
                <Text style={styles.subText}> 혹은 </Text>
                <Pressable onPress={handleForgotPw}>
                    <Text style={styles.pressableText}>비밀번호 찾기</Text>
                </Pressable>
            </View>
       </>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        marginBottom: 20,
    },
    pressableContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20
    },
    text: {
        lineHeight: 40,
        fontFamily: "noto-bold",
    },
    errMsg: {
        color: "red",
        fontFamily: "noto-med",
        textAlign: "center"
    },
    textBox: {
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
        fontFamily: "noto-med"
    }
});
