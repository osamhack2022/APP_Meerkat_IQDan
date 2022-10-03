// core
import { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
    MaterialCommunityIcons,
    MaterialIcons,
    AntDesign,
} from "@expo/vector-icons";
// thirds
import AsyncStorage from "@react-native-async-storage/async-storage";
// types
import { MainTabScreenProps } from "../common/types";
// context
import { LoginContext } from "../common/Context";

export default function Settings(props: MainTabScreenProps<"Settings">) {
    const {navigation} = props;
    
    const { refreshLoginToken } = useContext(LoginContext);

    const handleLogout = async () => {
        await AsyncStorage.setItem("userToken", "");
        await AsyncStorage.setItem("userTokenExpiration", "");
        refreshLoginToken();
        navigation.navigate("Auth")
    };


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>설정</Text>
            </View>
            <View style={styles.menucontainer}>
                <MaterialCommunityIcons
                    name="face-man-profile"
                    size={30}
                    color="#6A4035"
                />
                <Text style={styles.menuTitle}>{"  "}나의 프로필</Text>
            </View>
            <View style={styles.menucontainer}>
                <MaterialCommunityIcons
                    name="form-textbox-password"
                    size={30}
                    color="#6A4035"
                />
                <Text style={styles.menuTitle}>
                    {"  "}
                    비밀번호 변경
                </Text>
            </View>
            <View style={styles.menucontainer}>
                <MaterialCommunityIcons name="delete-outline" size={30} color="#6A4035" />
                <Text style={styles.menuTitle}>{"  "}회원 탈퇴</Text>
            </View>
            <TouchableOpacity style={styles.menucontainer} onPress={handleLogout}>
                <MaterialIcons name="logout" size={30} color="#6A4035" />
                <Text style={styles.menuTitle}>
                    {"  "}
                    로그아웃
                </Text>
            </TouchableOpacity>
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
        fontSize: 22,
        fontFamily: "noto-med",
        color: "#6A4035",
    },
});
