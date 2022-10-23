// core
import { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView, Text} from "react-native";
// types and comps
import Login from "./Login";
import Register from "./Register";
import ForgotPw from "./ForgotPw";
import { LoginContext } from "../common/Context";
import { RootStackScreenProps } from "../common/types";
// assets
const logo = require("../assets/logos/meerkat_black.png");
import env from "../env.json"
import api from "../common/api";

export default function Auth(props: RootStackScreenProps<"Auth">) {
    const { navigation } = props;
    const { checkIfLoggedIn, isNotLoggedIn } = useContext(LoginContext);
    const [currPage, setCurrPage] = useState<string>("");
    const [resp, setResp] = useState("")

    useEffect(() => {
        if (!isNotLoggedIn) navigation.navigate('Main', {screen: "ChatroomList"})
    }, [isNotLoggedIn])

    useEffect(() => {
        api.get("https://code.seholee.com:8090/").then((res) => {
            setResp(res.status.toString())
        }).catch((err) => {
            setResp(JSON.stringify(err))
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
                <Text>{resp}</Text>
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
