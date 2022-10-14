// core
import { useEffect, useState, useContext, useRef } from "react";
import { Alert, StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
// comps
import Searchbar from "../../components/ChatroomList/Searchbar";
import ChatroomBox from "../../components/ChatroomList/ChatroomBox";
import ChatroomLoading from "../../components/ChatroomList/ChatroomLoading";
import useDoubleFetchAndSave from "../../hooks/useDoubleFetchAndSave";
// types
import { Chatroom, MainTabScreenProps } from "../../common/types";
import Header from '../../components/FriendList/Header';

import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PwPrompt = (props: {visible: boolean, roomId: number, onClose: () => void}) => {
    let [pw, setPw] = useState("")
    let ref = useRef<TextInput>(null);

    const apply2ndPassword = async () => {
        if (pw == "") return;

        //TODO: 암호화 하기
        //

        await AsyncStorage.setItem("2ndPassword-" + props.roomId.toString(), "Yes");
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
    const {navigation} = props;
    const {rerender} = props.route.params;
    const [rooms, setRooms] = useState<Chatroom[]>([]);
    const {isLoading, reFetch} = useDoubleFetchAndSave(rooms, setRooms, "/chatroom/my")

    const [promptVisible, setPromptVisible] = useState(false);
    const [promptRoomId, setPromptRoomId] = useState(-1);

    useEffect(() => {    
        if (rerender) {
            reFetch()
        }   
    }, [rerender])

    const handleAddChatroom = () => {
        navigation.push("AddChatroom")
    }

    return (
        <>
        <Header categoryName="대화방" onPressAddFriend={handleAddChatroom} />
        <PwPrompt visible={promptVisible} roomId={promptRoomId} onClose={() => {setPromptVisible(false);}} />
        <View style={styles.container}>
            
            <Searchbar />
            <ScrollView>
                { isLoading ?? <ChatroomLoading /> } 
                { (rooms == null || rooms.length === 0) ?? <View style={styles.titleMsgContainer}><Text style={styles.titleMsg}>채팅방이 존재하지 않습니다.</Text></View> }
                {
                    rooms ? rooms.map((room) => 
                        <ChatroomBox
                            key={room.chatroomId}
                            chatroomId={room.chatroomId}
                            name={room.name}
                            type={room.type}
                            createDate={room.createDate}
                            updateDate={room.updateDate}
                            msgExpTime={room.msgExpTime}
                            navigation={navigation}
                            onPress2ndPwSetting={() => { setPromptVisible(true); setPromptRoomId(room.chatroomId); }}
                        />
                    ) : null
                }
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
