// core
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
// comps
import Searchbar from "../components/Searchbar";
import ChatRoomBox from "../components/ChatRoomBox";
import ChatRoomLoading from "../components/ChatRoomLoading";
// type
import { ChatRoom } from "../common/types";
// dummy data
import dummy from "../assets/dummy_data/chatroom.json";

export default function ChatRoomList() {
  const [rooms, setRooms] = useState<ChatRoom[] | null>(null);

  useEffect(() => {
    // load chat room data from async storage / also check for updates? no. data is updated via websocket or polling.

    // dummy load
    setRooms(dummy.data)
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>대화방</Text>
        <Text style={[styles.title]}>+</Text>
      </View>
      <Searchbar />
      {rooms == null ? (
        <ChatRoomLoading />
      ) : (
        rooms.map((room) => {
          return (
            <ChatRoomBox
              key={room.chatroomId}
              chatroomId={room.chatroomId}
              creatorId={room.creatorId}
              name={room.name}
              type={room.type}
              createDate={room.createDate}
              updateDate={room.updateDate}
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
    fontSize: 30,
    fontFamily: "noto-bold",
  },
});
