// core
import { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView} from "react-native";
// types and comps
import Login from "./Login";
import Register from "./Register";
import ForgotPw from "./ForgotPw";
import { LoginContext } from "../common/Context";
import { RootStackScreenProps } from "../common/types";
// assets
const logo = require("../assets/loginTitle.png");

export default function Auth(props: RootStackScreenProps<"Auth">) {
    const { navigation } = props;
    const { checkIfLoggedIn, isNotLoggedIn } = useContext(LoginContext);
    const [currPage, setCurrPage] = useState<string>("");

    useEffect(() => {
        if (!isNotLoggedIn) navigation.navigate('Main', {screen: "ChatroomList"})
    }, [isNotLoggedIn])

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
                </View>
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
        height: 200,
    },

    logo: {
        width: 150,
        height: 200,
    },
});
