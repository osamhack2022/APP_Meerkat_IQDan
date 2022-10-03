import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { RootStackScreenProps } from "../../common/types";

export default function ChangePw(props: RootStackScreenProps<"ChangePw">) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>비밀번호 변경</Text>
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
        paddingBottom: 10,
    },
    title: {
        fontSize: 25,
        fontFamily: "noto-bold",
        lineHeight: 45,
    },
});
