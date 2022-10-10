// core
import { useEffect, useState, useContext } from "react";
import { Alert, StyleSheet, Text, View, ScrollView } from "react-native";
// comps
import Searchbar from "../../components/ChatroomList/Searchbar";
import ChatroomBox from "../../components/ChatroomList/ChatroomBox";
import ChatroomLoading from "../../components/ChatroomList/ChatroomLoading";
import useDoubleFetchAndSave from "../../hooks/useDoubleFetch";
// types
import { Chatroom, MainTabScreenProps } from "../../common/types";
// dummy data
import api from "../../common/api";

export default function ChatroomList(props: MainTabScreenProps<"ChatroomList">) {
    const {navigation} = props;
    const [rooms, setRooms] = useState<Chatroom[] | null>(null);

    const {isLoading} = useDoubleFetchAndSave(rooms, setRooms, "/chatroom/my")

    const handleAddChatroom = () => {
        navigation.push("AddChatroom")
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>대화방</Text>
                <Text style={[styles.title]} onPress={handleAddChatroom}>+</Text>
            </View>
            <Searchbar />
            <ScrollView>
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
            <View style={{height: 200}}>
            </View>
            </ScrollView>
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
