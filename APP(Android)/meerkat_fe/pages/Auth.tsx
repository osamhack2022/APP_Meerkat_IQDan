// core
import { useState, useContext, Fragment, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
// types and comps
import Login from "./Login";
import Register from "./Register";
import ChangePw from "./ChangePw";
import { LoginContext } from "../common/Context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
// assets
const logo = require("../assets/logos/meerkat_black.png");

type AuthProps = NativeStackScreenProps<RootStackParamList, "Auth">;

export default function Auth(props: AuthProps) {
    const { navigation } = props;
    const { refreshLoginToken, isNotLoggedIn } = useContext(LoginContext);
    const [currPage, setCurrPage] = useState<string>("");

    useEffect(() => {
        if (!isNotLoggedIn) navigation.navigate('Home')
    }, [isNotLoggedIn])

    const showAuthComps = () => {
        switch (currPage) {
            case "register":
                return <Register />;
            case "changePw":
                return <ChangePw />;
            default:
                return (
                    <Login
                        setCurrPage={setCurrPage}
                        refreshLoginToken={refreshLoginToken}
                    />
                );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>
            {showAuthComps()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 120,
        alignItems: "center",
    },
    logoContainer: {
        height: 80,
    },

    logo: {
        width: 40,
        height: 40,
    },
});
