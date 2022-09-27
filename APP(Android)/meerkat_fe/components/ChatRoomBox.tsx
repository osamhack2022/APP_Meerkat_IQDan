import { StyleSheet, View, Text } from "react-native";
import { ChatRoom } from "../common/types";

export default function ChatRoomBox(props: ChatRoom) {
  const { chatroomId, creatorId, name, type, createDate, updateDate } = props;

  return (
    <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 130,
        backgroundColor: "#E5B47F",
        borderRadius: 20
    },
    title: {
        color: "white",
        fontFamily: "noto-bold",
        fontSize: 20,
        width: 130
    }, 
    time: {

    }, 

})
