// core
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert, Platform, SafeAreaView, BackHandler } from 'react-native';
// comps
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
//import ChatroomSide from '../components/Chatroom/ChatroomSide';
import MKBubble from '../components/Chatroom/CustomChatComp/Bubble';
import ChatroomAccessoryBar from '../components/Chatroom/ChatroomAccessoryBar';
import ChatroomTextInput from '../components/Chatroom/ChatroomTextInput';
import ChatroomTemplatePanel from '../components/Chatroom/ChatroomTemplatePanel';
// types
import { ChatroomWithKey, Chatroom, IMessageDto, IMessageSendDto, RootStackScreenProps, User } from '../common/types';
// context
import { LoginContext } from '../common/Context';
// thirds
import { GiftedChat, IMessage, User as IMessageUser } from 'react-native-gifted-chat';
import api from '../common/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDoubleFetchAndSave from '../hooks/useDoubleFetchAndSave';
import { useSocketIO } from '../hooks/useSocketIO';
import useMessage from '../hooks/useMessage';
import { isEmpty } from '../common/isEmpty';



export default function ChatroomPage(props: RootStackScreenProps<'Chat'>) {
  const { chatroomId } = props.route.params; // 현 채팅방의 chatroomId
  const { navigation } = props;


  // userId 가져오기
  const { isNotLoggedIn, userId } = useContext(LoginContext);
  // 소켓
  const { socket } = useSocketIO(isNotLoggedIn, null);

  // 채팅 메시지 리스트
  
  // UI 변화
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false); // 우측 메뉴
  const [templateVisible, setTemplateVisible] = useState(false); // 메시징 템플릿
  const [superiorOnly, setSuperiorOnly] = useState(false); // 상급자 요약
  const [msgInput, setMsgInput] = useState(''); // 현재 메세지

  // 채팅방 정보 가져오기
  const [chatroomInfo, setChatroomInfo] = useState<ChatroomWithKey | null>(null);
  const {isLoading: isChatroomInfoLoading} = useDoubleFetchAndSave<ChatroomWithKey | null>(
    chatroomInfo,
    setChatroomInfo,
    '/chatroom/' + chatroomId,
  );

  // 유저 정보 가져오기
  const [usersInfo, setUsersInfo] = useState<User[]>([])
  const {isLoading: isUserInfoLoading} = useDoubleFetchAndSave<User[] | null>(
    usersInfo, setUsersInfo, '/chatroom/getAllUsersInfo/' + chatroomId
  )
  // 유저 정보가 받아와 졌을 때 실행
  const [IMessageUsersInfo, setIMessageUsersInfo] = useState<Map<number, IMessageUser>>(new Map<number, IMessageUser>());
  useEffect(() => {
    IMessageUsersInfo.clear();
    const newUsersInfoMap: Map<number, IMessageUser> = new Map<number, IMessageUser>;
    usersInfo.forEach((elem: User) => {
      newUsersInfoMap.set(elem.userId, {_id:elem.userId, name:elem.name});
    });
    setIMessageUsersInfo(newUsersInfoMap);
  }, [isUserInfoLoading]);

  // 메시지 가져오기
  const { messages, sendNewMessageToServer, getNewMessagesFromSocket, onSend} = useMessage(chatroomId, userId, IMessageUsersInfo, socket)

  // TODO: 나중에 여기 socket 부분 분리.
  // TODO : 방 나갈 때 event 만들고 서버에서 받기.
  useEffect(() => {
    if (IMessageUsersInfo.size === 0) return;
    socket.on('connect', () =>{
      console.log('--------------- room socket ---------------');
      console.log(chatroomId + " socket connection 시작");

      socket.emit("client:joinChatroom", chatroomId);

      socket.on('server:hearMessage', (messageDto: IMessageDto) => {
        console.log(chatroomId + "message 수신: ");
        console.log(messageDto);
        console.log(IMessageUsersInfo.get(messageDto.senderId));

        if(isEmpty(IMessageUsersInfo.get(messageDto.senderId))) new Error("서버에 문제가 발생했습니다.");
        getNewMessagesFromSocket([
          {
            _id: messageDto._id,
            text: messageDto.text,
            createdAt: messageDto.sendTime,
            user: IMessageUsersInfo.get(messageDto.senderId)!,
          },
        ]);
      });

      socket.on("disconnect", () => {
        console.log('--------------- room disconnected ---------------');
      });
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });

    // clean은 hooks에서 해 줌.
    return()=>{
      socket.disconnect();
    }
  }, [socket, IMessageUsersInfo]);
  
  if(isUserInfoLoading || IMessageUsersInfo.size === 0) return (<></>);
  return (
    <>
      {/* <ChatroomSide isOpen={isOpenSideMenu} setIsOpen={setIsOpenSideMenu} /> */}  
      <SafeAreaView style={{ flex:0 }} />
      <ChatroomHeader
        onPressBack={() => navigation.navigate("Main", {screen:"ChatroomList", params: {rerender: true}})}
        onPressSideMenu={() => setIsOpenSideMenu(true)}
        name={chatroomInfo?.name || ''}
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1}}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -300} // should be 0 for ios, but Platform.select not working currnetly.
      >
        <View style={styles.chat}>
          <GiftedChat
            messages={messages}
            onSend={(messages: any) => onSend(messages)}
            renderBubble={MKBubble}
            timeTextStyle={{
              left: { color: 'black' },
              right: { color: 'white' },
            }}
            user={{_id:userId}}
            wrapInSafeArea={false}
            isKeyboardInternallyHandled={false}
            renderInputToolbar={() => null}
            maxComposerHeight={0}
            minInputToolbarHeight={0}
            inverted={false}
          />
          <ChatroomTextInput
            msgInput={msgInput}
            setMsgInput={setMsgInput}
            onSendTextMessage={text => sendNewMessageToServer(text)}
          />
        </View>
      </KeyboardAvoidingView>
      <ChatroomAccessoryBar
        superiorOnly={superiorOnly}
        onPressTemplate={() => setTemplateVisible(true)}
        onPressSuperiorSwitch={() => setSuperiorOnly(!superiorOnly)}
        // onSend={onSendFromUser} // TODO: 로컬에서만 보내지니까 풀어줘도될듯? 테스팅해보고 풀어주기.
        onSend ={() => {}}
      />
      <ChatroomTemplatePanel
        visible={templateVisible}
        setVisible={setTemplateVisible}
        setMsgInput={setMsgInput}
      />
      <SafeAreaView style={{ flex:0, backgroundColor: 'white' }} />
    </>
  );
}

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});


