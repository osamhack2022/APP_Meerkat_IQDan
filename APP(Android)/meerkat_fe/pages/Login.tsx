// core
import { useContext, useState } from "react";
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    Image,
    Button,
    Pressable,
} from "react-native";
// context
import { PageContext } from "../components/Auth"
// thirds
import axios from "axios";
// assets
const logo = require("../assets/meerkat_black.png");

export default function Login() {
    const {page, setPage} = useContext(PageContext)
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const handleLogin = () => {
        axios.post("https://code.seholee.com:8082/auth/login", {
            uid: id,
            password: pw
        }).then((res) =>{
            console.log(res.headers["set-cookie"])
        }).catch((err)=> {
            console.log(err.response)
        })
    };

    const handleRegister = () => {
        setPage('register')
    };

    const handleForgotPw = () => {
        setPage('changePw')
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.innerContainer}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 120,
        alignItems: "center",
    },
    innerContainer: {
        marginBottom: 20
    },
    logoContainer: {
        height: 80,
    },
    pressableContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20
    },
    logo: {
        width: 40,
        height: 40,
    },
    text: {
        lineHeight: 40,
        fontFamily: "noto-bold",
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
