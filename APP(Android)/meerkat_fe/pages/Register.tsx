// core
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Button,
    Pressable,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
// thirds
import axios from "axios";

export default function Register(props: { setCurrPage: Function }) {
    const { setCurrPage } = props;
    const [errMsg, setErrMsg] = useState("");
    const [uid, setUid] = useState("");
    const [pw, setPw] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    const [name, setName] = useState("");
    const [serviceNumber, setServiceNumber] = useState("");
    const [enlistmentDate, setEnlistmentDate] = useState("");
    const [affiliatedUnit, setAffiliatedUnit] = useState("");
    const [militaryRank, setMilitaryRank] = useState("");

    const handleRegister = () => {
        if (!isEnlistmentDateValid()) {
            return Alert.alert(
                ":/",
                "입대일을 2000-01-01 형식으로 적어주세요.",
                [
                    {
                        text: "확인",
                        onPress: () => {},
                    },
                ]
            );
        }
        console.log({
            uid: uid,
            password: pw,
            name: name,
            serviceNumber: serviceNumber,
            enlistmentDate: enlistmentDate + "T00:00:00.000Z",
            affiliatedUnit: affiliatedUnit,
            militaryRank: militaryRank,
        });

        axios
            .post("https://code.seholee.com:8082/users", {
                uid: uid,
                password: pw,
                name: name,
                serviceNumber: serviceNumber,
                enlistmentDate: enlistmentDate + "T00:00:00.000Z",
                affiliatedUnit: affiliatedUnit,
                militaryRank: militaryRank,
            })
            .then(async (res) => {
                Alert.alert("환영합니다", "회원가입이 완료되었습니다.", [
                    {
                        text: "확인",
                        onPress: () => setCurrPage(""),
                    },
                ]);
            })
            .catch((err) => {
                console.log(err.response.data);
                let errText = "알 수 없는 이유로 회원가입에 실패하였습니다.";
                if (err.response.status === 409) {
                    if (err.response.data.customCode === "errCode1") {
                        errText = "이미 존재하는 아이디입니다.";
                    } else if (err.response.data.customCode === "errCode2") {
                        errText = "이미 존재하는 군번입니다.";
                    }
                }
                Alert.alert(":(", errText, [
                    {
                        text: "확인",
                        onPress: () => {},
                    },
                ]);
            });
    };

    useEffect(() => {
        if (pwCheck === "") return;
        if (pw !== pwCheck) {
            setErrMsg("비밀번호가 일치하지 않습니다.");
        } else {
            setErrMsg("");
        }
    }, [pw, pwCheck]);

    const handleLogin = () => {
        setCurrPage("");
    };

    const handleForgotPw = () => {
        setCurrPage("forgotPw");
    };

    const isEnlistmentDateValid = () => {
        const regex = RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
        if (regex.test(enlistmentDate)) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <>
            <View style={styles.innerContainer}>
                <Text style={styles.errMsg}>{errMsg}</Text>
                <Text style={styles.text}>아이디</Text>
                <View style={styles.row}>
                    <TextInput
                        onChangeText={setUid}
                        value={uid}
                        style={styles.textBox}
                    />
                </View>
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
                <Text style={styles.text}>이름</Text>
                <TextInput
                    onChangeText={setName}
                    value={name}
                    style={styles.textBox}
                />
                <Text style={styles.text}>군번</Text>
                <TextInput
                    onChangeText={setServiceNumber}
                    value={serviceNumber}
                    style={styles.textBox}
                />
                <Text style={styles.text}>입대일</Text>
                <TextInput
                    onChangeText={setEnlistmentDate}
                    value={enlistmentDate}
                    style={styles.textBox}
                    placeholder="2022-01-01"
                />
                <Text style={styles.text}>소속</Text>
                <TextInput
                    onChangeText={setAffiliatedUnit}
                    value={affiliatedUnit}
                    style={styles.textBox}
                />
                <Text style={styles.text}>계급</Text>
                <TextInput
                    onChangeText={setMilitaryRank}
                    value={militaryRank}
                    style={styles.textBox}
                />
            </View>
            <Button onPress={handleRegister} title="가입하기" color="#6A4035" />
            <View style={styles.pressableContainer}>
                <Text style={styles.subText}>또는 </Text>
                <Pressable onPress={handleLogin}>
                    <Text style={styles.pressableText}>로그인</Text>
                </Pressable>
                <Text style={styles.subText}> 혹은 </Text>
                <Pressable onPress={handleForgotPw}>
                    <Text style={styles.pressableText}>비밀번호 찾기</Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        marginBottom: 10,
    },
    pressableContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    text: {
        fontSize: 12,
        lineHeight: 15,
        fontFamily: "noto-bold",
    },
    errMsg: {
        color: "red",
        fontFamily: "noto-med",
        textAlign: "center",
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
    pressableText: {
        color: "#E5B47F",
        fontFamily: "noto-bold",
    },
    subText: {
        fontFamily: "noto-med",
    },
    row: {
        flexDirection: "row",
    },
});
