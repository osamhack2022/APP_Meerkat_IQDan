import { StyleSheet, Text, View } from "react-native";
import {
    MaterialCommunityIcons,
    MaterialIcons,
    AntDesign,
} from "@expo/vector-icons";

export default function Settings() {
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
            <View style={styles.menucontainer}>
                <MaterialIcons name="logout" size={30} color="#6A4035" />
                <Text style={styles.menuTitle}>
                    {"  "}
                    로그아웃
                </Text>
            </View>
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
    },
    title: {
        fontSize: 25,
        fontFamily: "noto-bold",
        lineHeight: 45,
    },
    logout: {
        marginTop: 20,
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
