// core
import { useEffect, useState, useContext } from "react";
import { Alert, StyleSheet, Text, View, ScrollView } from "react-native";
// comps
import Searchbar from "../../components/ChatroomList/Searchbar";
import ChatroomBox from "../../components/ChatroomList/ChatroomBox";
import ChatroomLoading from "../../components/ChatroomList/ChatroomLoading";
// types
import { Chatroom, MainTabScreenProps } from "../../common/types";
// dummy data
import api from "../../common/api";

import {
    MaterialCommunityIcons,
    Feather,
    MaterialIcons,
    AntDesign
} from "@expo/vector-icons";

export default function ChatroomList(props: MainTabScreenProps<"ChatroomList">) {
    const {navigation} = props;
    const [rooms, setRooms] = useState<Chatroom[] | null>(null);
    const [pageState, setPageState] = useState<string>("loading");

    useEffect(() => {
        // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.
        api.get("/chatroom/my").then((res) => {
            //setRooms(res.data.data)
            setPageState("loaded");
        }).catch((err) => {
            Alert.alert("오류가 발생했습니다.")
        })
    }, []);

    const handleAddChatroom = () => {
        navigation.push("AddChatroom")
    }

    const roomsComponent=()=>{
        if (pageState == "loading") {return <ChatroomLoading />}
        else if (pageState == "error") {return <View><Text>Error!!!!</Text></View>}
        else if (rooms===null || rooms.length===0) {return <View style={styles.titleMsgContainer}><Text style={styles.titleMsg}>채팅방이 존재하지 않습니다.</Text></View>}
        return rooms.map((room) => {
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
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>대화방</Text>
                <Text style={[styles.title]} onPress={handleAddChatroom}>+</Text>
            </View>
            <Searchbar />
            <ScrollView>
            {roomsComponent()}
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
    titleMsgContainer:{
        flexDirection: "row",
        justifyContent: "center",
    },
    titleMsg:{
        alignSelf:"center",
        justifyContent: "center",
        fontSize: 15,
        fontFamily: "noto-reg",
        color:"#979797",
        lineHeight: 45,
        marginTop:50
    }
});
