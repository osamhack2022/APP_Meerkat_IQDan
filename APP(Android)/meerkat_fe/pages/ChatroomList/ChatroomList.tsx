// core
import { useEffect, useState, useContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
// comps
import Searchbar from "../../components/ChatroomList/Searchbar";
import ChatroomBox from "../../components/ChatroomList/ChatroomBox";
import ChatroomLoading from "../../components/ChatroomList/ChatroomLoading";
// types
import { Chatroom, MainTabScreenProps } from "../../common/types";
// dummy data
import api from "../../common/api";

export default function ChatroomList(props: MainTabScreenProps<"ChatroomList">) {
    const {navigation} = props;
    const [rooms, setRooms] = useState<Chatroom[] | null>(null);

    useEffect(() => {
        // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
        api.get("/chatroom/my").then((res) => {
            setRooms(res.data.data)
            // console.log(res.data)
            
        }).catch((err) => {
            Alert.alert("오류가 발생했습니다.")
        })
    }, []);

    const handleAddChatroom = () => {
        navigation.push("AddChatroom")
    }
    // console.log(rooms)

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>대화방</Text>
                <Text style={[styles.title]} onPress={handleAddChatroom}>+</Text>
            </View>
            <Searchbar />
            {rooms === null ? (
                <ChatroomLoading />
            ) : (
                rooms.map((room) => {
                    return (
                        <ChatroomBox
                            key={room.chatroomId}
                            chatroomId={room.chatroomId}
                            name={room.name}
                            type={room.type}
                            createDate={room.createDate}
                            updateDate={room.updateDate}
                            msgExpTime={room.msgExpTime}
                            navigation={navigation}
                        />
                    );
                })
            )}
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
});
