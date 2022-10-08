import { StyleSheet, View, Text, Image } from "react-native";
import { Chatroom } from "../../common/types";
const dotsImage = require("../../assets/icons/dots_vertical.png");

export default function ChatroomBox(props: Chatroom) {
  const { chatroomId, name, type, createDate, updateDate, msgExpTime } = props;

  return (
    <View style={styles.container}>
        <View style={styles.upperContainer}>
            <Text style={styles.title}>{name}</Text>
            <Image style={styles.dots} source={dotsImage}/>
        </View>
        <View style={styles.lowerContainer}>
            <Text style={styles.time}>마지막 대화 1시간 전</Text>
            <Text style={styles.count}>10</Text>
        </View>
    </View>
  );
}
// #6A4035
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingLeft: 20,
        paddingRight: 10,
        height: 130,
        backgroundColor: "#E5B47F",
        borderRadius: 20,
        justifyContent:"space-between"
    },
    upperContainer: {
        // backgroundColor: "black",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 10
    },
    lowerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 5
    },
    title: {
        color: "white",
        fontFamily: "noto-bold",
        fontSize: 20,
        width: 130,
        lineHeight: 30
    },
    dots: {
        tintColor: "white",
        marginTop: 8,
        marginRight: 8
    },
    time: {
        color: "white",
        fontFamily: "noto-med",
        fontSize: 10,
    }, 
    count: {
        fontFamily: "noto-med",
        color: "white",
        lineHeight: 20,
        backgroundColor: "#6A4035",
        marginRight: 8,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 10,
    },
})
