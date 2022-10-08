import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { RootStackScreenProps } from "../../common/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function ChangePw(props: RootStackScreenProps<"ChangePw">) {
    const { navigation } = props;
    const [errMsg, setErrMsg] = useState("");
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");

    useEffect(() => {
        if (pwCheck === "") return;
        if (pw !== pwCheck) {
            setErrMsg("비밀번호가 일치하지 않습니다.");
        } else {
            setErrMsg("");
        }
    }, [pw, pwCheck]);

    return (
        <View style={styles.container}>
            
            <View style={styles.titleContainer}>
            <Text style={styles.title}>
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="chevron-back"
                        size={24}
                        color="black"
                    />비밀번호 변경</Text>    
               </View>
               <View style={styles.row}>
               <Text style={styles.text}>비밀번호</Text>
                <TextInput
                    onChangeText={setPw}
                    value={pw}
                    style={styles.textBox}
                    secureTextEntry={true}
                />
                <Text style={styles.text}>비밀번호 확인</Text>
                <TextInput
                    onChangeText={setPwCheck}
                    value={pwCheck}
                    style={styles.textBox}
                    secureTextEntry={true}
                />
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
    innerContainer: {
        marginBottom: 10,
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
    text: {
        fontSize: 12,
        lineHeight: 15,
        fontFamily: "noto-bold",
    },
    textBox: {
        fontSize: 12,
        lineHeight: 20,
        width: 250,
        borderBottomWidth: 1,
        borderColor: "black",
        marginBottom: 20,
        fontFamily: "noto-med",
    },
    row: {
        flexDirection: "row",
    },
});
