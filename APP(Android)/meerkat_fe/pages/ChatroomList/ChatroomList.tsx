// core
import { useEffect, useState, useContext, useRef } from "react";
import { Alert, StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
// comps
import Searchbar from "../../components/ChatroomList/Searchbar";
import ChatroomBox from "../../components/ChatroomList/ChatroomBox";
import ChatroomLoading from "../../components/ChatroomList/ChatroomLoading";
import useDoubleFetchAndSave from "../../hooks/useDoubleFetchAndSave";
// types
import { ChatroomUnread, MainTabScreenProps } from "../../common/types";
import Header from '../../components/FriendList/Header';
import { SocketContext } from "../../common/Context";
// thirds
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons'; 
import Dialog from "react-native-dialog";
import { hashMD5 } from "../../common/crypto";
import { useIsFocused } from '@react-navigation/native'



const PwPrompt = (props: {visible: boolean, roomId: number, onClose: () => void}) => {
    let [pw, setPw] = useState("")
    let ref = useRef<TextInput>(null);

    const apply2ndPassword = async () => {
        if (pw == "") return;
        let hash = hashMD5(pw);
        await AsyncStorage.setItem("2ndPassword-" + props.roomId.toString(), hash);
        props.onClose();    
    }

    useEffect(() => {
        if (!props.visible) return;
        setPw("");
    }, [props.visible])

    return (
        <Dialog.Container visible={props.visible}>
            <Dialog.Title>2차 비밀번호 설정</Dialog.Title>
            <Dialog.Description>
                방을 2차 비밀번호로 암호화하여 
            </Dialog.Description>
            <Dialog.Description>
                보안을 강화합니다.
            </Dialog.Description>
            <Dialog.Input textInputRef={ref} value={pw} onChangeText={setPw}/>
            <Dialog.Button onPress={props.onClose} label="취소" />
            <Dialog.Button onPress={apply2ndPassword} label="확인" />
        </Dialog.Container>
    )
}

export default function ChatroomList(props: MainTabScreenProps<"ChatroomList">) {
    const { socket } = useContext(SocketContext);
    const {navigation} = props;
    const [rooms, setRooms] = useState<ChatroomUnread[] | null>(null);
    const {isLoading, reFetch} = useDoubleFetchAndSave(rooms, setRooms, "/chatroom/myUnreads");
    const [keyExists, setKeyExists] = useState(false)
    const isFocused = useIsFocused()
  
    // 서버에서 메시지를 보냈을 때, unread count++
    // socket이 바뀌면 event attach함.
    useEffect(()=> {
      socket.on("server:notificateMessage", (content:string) => {
        reFetch();
      });
    }, [socket]);

    const [promptVisible, setPromptVisible] = useState(false);
    const [promptRoomId, setPromptRoomId] = useState(-1);

    useEffect(() => {    
        reFetch();
    }, [isFocused]);

    useEffect(() => {
        async function init() {
            const privKey = await AsyncStorage.getItem('PrivateKey')
            if (privKey !== null) {
                setKeyExists(true)
            }
        }
        init()
    }, [])

    const handleAddChatroom = () => {
        navigation.push("AddChatroom");
    }

    const roomsComponent=()=> {
        if (isLoading) {return <ChatroomLoading />}
        else if (!keyExists) {return <View style={styles.warning}><AntDesign style={{marginBottom: 20}}name="exclamationcircle" size={24} color="lightgrey" /><Text style={{color: "grey"}}>설정에서 암호키를 생성해주세요.</Text></View>}
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
                    unreadCount={room.numUnreadMessages}
                    navigation={navigation}
                    onPress2ndPwSetting={() => {setPromptVisible(true); setPromptRoomId(room.chatroomId)}}
                />
            );
        });
    };

    return (
        <>
        <Header categoryName="대화방" onPressAddFriend={handleAddChatroom} />
        <PwPrompt visible={promptVisible} roomId={promptRoomId} onClose={() => {setPromptVisible(false);}} />
        <View style={styles.container}>
            
            <Searchbar />
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
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
    scroll:{
        marginBottom: 161,
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
    },
    warning: {
        marginTop: 40,
        alignItems: "center"
    }
});
