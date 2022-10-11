// core
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert, Platform, SafeAreaView } from 'react-native';
// comps
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
//import ChatroomSide from '../components/Chatroom/ChatroomSide';
import MKBubble from '../components/Chatroom/CustomChatComp/Bubble';
import ChatroomAccessoryBar from '../components/Chatroom/ChatroomAccessoryBar';
import ChatroomTextInput from '../components/Chatroom/ChatroomTextInput';
import ChatroomTemplatePanel from '../components/Chatroom/ChatroomTemplatePanel';
// types
import { ChatroomWithKey, Chatroom, IMessageDto, IMessageSendDto, RootStackScreenProps } from '../common/types';
// context
import { LoginContext, SocketContext } from '../common/Context';
// thirds
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import api from '../common/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDoubleFetchAndSave from '../hooks/useDoubleFetchAndSave';
import { useSocketIO } from '../hooks/useSocketIO';



export default function ChatroomPage(props: RootStackScreenProps<'Chat'>) {
  const { chatroomId } = props.route.params; // 현 채팅방의 chatroomId
  const { navigation } = props;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [chatroomInfo, setChatroomInfo] = useState<ChatroomWithKey | null>(null);
  
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false); // 우측 메뉴
  const [templateVisible, setTemplateVisible] = useState(false); // 메시징 템플릿
  const [superiorOnly, setSuperiorOnly] = useState(false); // 상급자 요약
  const [msgInput, setMsgInput] = useState(''); // 현재 메세지
  const { isLoading } = useDoubleFetchAndSave<ChatroomWithKey | null>(
    chatroomInfo,
    setChatroomInfo,
    '/chatroom/' + chatroomId,
  );

  console.log(chatroomInfo)

  const { isNotLoggedIn } = useContext(LoginContext);
  const { socket } = useSocketIO(isNotLoggedIn, null);

  const [initialLoad, setInitialLoad] = useState(true)

  // TODO: 나중에 여기 socket 부분 분리.
  // TODO : 방 나갈 때 event 만들고 서버에서 받기.
  useEffect(() => {
    if (initialLoad) {
      return setInitialLoad(false)
    }


    socket.on('connect', () =>{
      console.log('--------------- room socket ---------------');
      console.log(chatroomId + " socket connection 시작");

      socket.emit("joinRoom", chatroomId);

      socket.on('hearMessage', (messageDto: IMessageDto) => {
        console.log(chatroomId + "message 수신: ");
        console.log(messageDto);

        if (messageDto.isSender) {
          onSend([
            {
              _id: messageDto._id,
              text: messageDto.text,
              user: user,
              createdAt: messageDto.sendTime
            },
          ]);
        }
        else{
          setMessages(previousMessages => {
            const sentMessages: IMessage[] = [
              {
                _id: messageDto._id,
                createdAt: new Date(),
                text: messageDto.text,
                sent: true,
                received: true,
                user: messageDto.isSender? user: otherUser
              },
            ];
    
            return GiftedChat.append(previousMessages, sentMessages);
          });
        }
      });

      socket.on("disconnect", () => {
        console.log('--------------- room disconnected ---------------');
      });
    })
   

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });

    // clean은 hooks에서 해 줌.
    return()=>{
      socket.disconnect();
    }
  }, [socket]);

  useEffect(() => {
    // dummy data
    setMessages(msgSample);

    const messageDto2IMessage = (message: any):IMessage=>{
      return {
        _id:message._id,
        text:message.text,
        createdAt:message.sendTime,
        user: message.isSender?user:otherUser
        // TODO : sender가 아닌 경우 해당 user로 fetch해야 함.
      }
    }

    api
      .post('/messages/unread', {
        chatroomId: chatroomId,
      })
      .then(res => {
        let result: IMessageDto[] = res.data.data;
        const unreads: IMessage[] = result.map(message => {
          console.log(message);
          return messageDto2IMessage(message);
        });
        setMessages(unreads);
      });


  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const onSendFromUser = (msg: IMessage[] = []) => {
    const createdAt = new Date();
    const messagesToUpload = msg.map(message => ({
      ...message,
      user,
      createdAt,
      _id: messages.length + 1,
    }));
    onSend(messagesToUpload);
  };

  const sendTextMessage = (text: string) => {

    // TODO : disconneted일 때 예외처리 해야 할 듯.
    if(socket.connected){
      const IMessageSendDto:IMessageSendDto = {
        text: text,
        belongChatroomId: chatroomId,
        deleteTime: new Date(),
        sendTime: new Date()
      };

      socket.emit("speakMessage", IMessageSendDto);
    }
  };
  
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
            user={{ _id: 1 }}
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
            onSendTextMessage={text => sendTextMessage(text)}
          />
        </View>
      </KeyboardAvoidingView>
      <ChatroomAccessoryBar
        superiorOnly={superiorOnly}
        onPressTemplate={() => setTemplateVisible(true)}
        onPressSuperiorSwitch={() => setSuperiorOnly(!superiorOnly)}
        onSend={onSendFromUser}
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
const user = {
  _id: 1,
  name: 'Developer',
};

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: require('../assets/users/emptyProfile.jpg'),
};

const msgSample: IMessage[] = [
  {
    _id: 1,
    text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
    createdAt: new Date(),
    user: otherUser,
  },
  {
    _id: 2,
    text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
    createdAt: new Date(),
    user: otherUser,
  },
];
