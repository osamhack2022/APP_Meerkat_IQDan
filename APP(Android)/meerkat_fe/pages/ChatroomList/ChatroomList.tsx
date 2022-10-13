// core
import { useEffect, useState, useContext } from "react";
import { Alert, StyleSheet, Text, View, ScrollView } from "react-native";
// comps
import Searchbar from "../../components/ChatroomList/Searchbar";
import ChatroomBox from "../../components/ChatroomList/ChatroomBox";
import ChatroomLoading from "../../components/ChatroomList/ChatroomLoading";
import useDoubleFetchAndSave from "../../hooks/useDoubleFetchAndSave";
// types
import { Chatroom, MainTabScreenProps } from "../../common/types";
import Header from '../../components/FriendList/Header';
import { SocketContext } from "../../common/Context";

export default function ChatroomList(props: MainTabScreenProps<"ChatroomList">) {
    const { socket } = useContext(SocketContext);
    const {navigation} = props;
    const {rerender} = props.route.params;
    const [rooms, setRooms] = useState<Chatroom[] | null>(null);
    const {isLoading, reFetch} = useDoubleFetchAndSave(rooms, setRooms, "/chatroom/myUnreads");
  
    // 서버에서 메시지를 보냈을 때, unread count++
    // socket이 바뀌면 event attach함.
    useEffect(()=> {
      socket.on("server:notificateMessage", (content:string) => {
        console.log("content: "+content);
        reFetch();
      });
    }, [socket]);

    useEffect(() => {    
        if (rerender) {
            reFetch();
        }   
    }, [rerender]);

    const handleAddChatroom = () => {
        navigation.push("AddChatroom");
    }

    const roomsComponent = () => {
      if (isLoading) {
        return <ChatroomLoading />;
      } else if (rooms === null || rooms.length === 0) {
        return (
          <View style={styles.titleMsgContainer}>
            <Text style={styles.titleMsg}>채팅방이 존재하지 않습니다.</Text>
          </View>
        );
      }
      return rooms.map(room => {
        return (
          <ChatroomBox
            key={room.chatroomId}
            chatroomId={room.chatroomId}
            name={room.name}
            type={room.type}
            createDate={room.createDate}
            updateDate={room.updateDate}
            msgExpTime={room.msgExpTime}
            unreadCount={room.numUnreadMessages}
            navigation={navigation}
          />
        );
      });
    };

    return (
        <>
        <Header categoryName="대화방" onPressAddFriend={handleAddChatroom} />
        <View style={styles.container}>
            
            <Searchbar />
            <ScrollView>
            {roomsComponent()}
            </ScrollView>
            <View style={{height: 200}}>
            </View>
        </View>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
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
