// core
import { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, Text} from "react-native";
// types and comps
import Login from "./Login";
import ForgotPw from "./ForgotPw";
import Register from "./Register";
import { LoginContext } from "../common/Context";
import { RootStackScreenProps } from "../common/types";
// assets
const logo = require("../assets/logos/meerkat_black.png");
import env from "../env.json"
import api from "../common/api";

import axios from 'axios'

export default function Auth(props: RootStackScreenProps<"Auth">) {
    const { navigation } = props;
    const { checkIfLoggedIn, isNotLoggedIn } = useContext(LoginContext);
    const [currPage, setCurrPage] = useState<string>("");
    const [resp, setResp] = useState("")
    const [resp2, setResp2] = useState("")
    const [resp3, setResp3] = useState("")
    const [resp4, setResp4] = useState("")
    const [resp5, setResp5] = useState("")

    useEffect(() => {
        if (!isNotLoggedIn) navigation.navigate('Main', {screen: "ChatroomList"})
    }, [isNotLoggedIn])

    useEffect(() => {
        api.get("/").then((res) => {
            setResp("resp1succ" + JSON.stringify(res) + "\n")
        }).catch((err) => {
            setResp("res1fail" + JSON.stringify(err)+"\n")
        })
        fetch('https://code.seholee.com:8090/').then((res) => {
            setResp2("resp2succ" + JSON.stringify(res)+"\n")
        }).catch((err) => {
            setResp2("resp2fail" + JSON.stringify(err)+"\n")
        })

        axios.get("https://google.com").then((res) => {
            setResp3("resp3succ" + JSON.stringify(res) + "\n")
        }).catch((err) => {setResp3("resp3fail"+JSON.stringify(err)+"\n")})

        fetch('https://google.com').then((res) => {
            setResp4("resp4succ" + JSON.stringify(res))
        }).catch((err) => {
            setResp4("resp4fail" + JSON.stringify(err))
        })

        axios.get("http://code.seholee.com:8081").then((res) => {
            setResp5("resp5succ" + JSON.stringify(res))
        }).catch((err) => {
            setResp5("resp5fail" + JSON.stringify(err))
        })
    }, [])

    const showAuthComps = () => {
        switch (currPage) {
            case "register":
                return <Register setCurrPage={setCurrPage} />;
            case "forgotPw":
                return <ForgotPw setCurrPage={setCurrPage} />;
            default:
                return (
                    <Login
                        setCurrPage={setCurrPage}
                        checkIfLoggedIn={checkIfLoggedIn}
                    />
                );
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={styles.logo} />
                    <Text>{env.dev.apiBaseUrl}</Text>
                </View>
                <Text>{resp}!@#</Text>
                <Text>{resp2}!@#</Text>
                <Text>{resp3}!@#</Text>
                <Text>{resp4}!@#</Text>
                <Text>{resp5}!@#</Text>
                {showAuthComps()}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        alignItems: "center",
    },
    logoContainer: {
        height: 60,
    },

    logo: {
        width: 40,
        height: 40,
    },
});
