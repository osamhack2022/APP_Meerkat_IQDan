// core
import { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import {
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
// thirds
import AsyncStorage from "@react-native-async-storage/async-storage";
// types
import { MainTabScreenProps } from "../common/types";
// context
import { LoginContext } from "../common/Context";

export default function Settings(props: MainTabScreenProps<"Settings">) {
    const {navigation} = props;
    const { checkIfLoggedIn } = useContext(LoginContext);


    const handleMyProfile = () => {
        navigation.navigate("MyProfile")
    }

    const handleChangePw = () => {
        navigation.navigate("ChangePw")
    }


    const handleRemoveUser = () => {
        Alert.alert(
            ":/",
            "현재 지원되지 않는 기능입니다.",
            [
                {
                    text: "확인",
                    onPress: () => {},
                },
            ]
        );
    }


    const handleLogout = async () => {
        await AsyncStorage.setItem("userToken", "");
        await AsyncStorage.setItem("userTokenExpiration", "");
        checkIfLoggedIn();
        navigation.navigate("Auth")
    };


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>설정</Text>
            </View>
            <TouchableOpacity style={styles.menucontainer} onPress={handleMyProfile}>
                <MaterialCommunityIcons
                    name="face-man-profile"
                    size={30}
                    color="#6A4035"
                />
                <Text style={styles.menuTitle}>{"  "}나의 프로필</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menucontainer} onPress={handleChangePw}>
                <MaterialCommunityIcons
                    name="form-textbox-password"
                    size={30}
                    color="#6A4035"
                />
                <Text style={styles.menuTitle}>
                    {"  "}
                    비밀번호 변경
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menucontainer} onPress={handleRemoveUser}>
                <MaterialCommunityIcons name="delete-outline" size={30} color="#6A4035" />
                <Text style={styles.menuTitle}>{"  "}회원 탈퇴</Text>
            </TouchableOpacity>
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
        fontSize: 20,
        fontFamily: "noto-med",
        color: "#6A4035",
    },
});
