// core
import React, { useState, useCallback, useEffect, useContext, ReactNode } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Alert, Platform, SafeAreaView, BackHandler, Pressable } from 'react-native';
// comps
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
import ChatroomSide from '../components/Chatroom/ChatroomSide';
import MKBubble from '../components/Chatroom/CustomChatComp/Bubble';
import ChatroomAccessoryBar from '../components/Chatroom/ChatroomAccessoryBar';
import ChatroomTextInput from '../components/Chatroom/ChatroomTextInput';
import ChatroomTemplatePanel from '../components/Chatroom/ChatroomTemplatePanel';
// types
import {
  ChatroomWithKey,
  Chatroom,
  IMessageDto,
  IMessageSendDto,
  RootStackScreenProps,
  User,
} from '../common/types';
// context
import { LoginContext } from '../common/Context';
// thirds
import { Bubble, BubbleProps, Day, GiftedChat, IMessage, Time, User as IMessageUser } from 'react-native-gifted-chat';
import api from '../common/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDoubleFetchAndSave from '../hooks/useDoubleFetchAndSave';
import { useSocketIO } from '../hooks/useSocketIO';
import useMessage from '../hooks/useMessage';
import { isEmpty } from '../common/isEmpty';
import FlashMessage, { showMessage } from 'react-native-flash-message';
// icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

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
  const [chatroomInfo, setChatroomInfo] = useState<ChatroomWithKey | null>(
    null,
  );
  const { isLoading: isChatroomInfoLoading } =
    useDoubleFetchAndSave<ChatroomWithKey | null>(
      chatroomInfo,
      setChatroomInfo,
      '/chatroom/' + chatroomId,
    );

  // 유저 정보 가져오기
  const [usersInfo, setUsersInfo] = useState<User[]>([]);
  const { isLoading: isUserInfoLoading } = useDoubleFetchAndSave<User[] | null>(
    usersInfo,
    setUsersInfo,
    '/chatroom/getAllUsersInfo/' + chatroomId,
  );
  // 유저 정보가 받아와 졌을 때 실행
  const [IMessageUsersInfo, setIMessageUsersInfo] = useState<
    Map<number, IMessageUser>
  >(new Map<number, IMessageUser>());
  useEffect(() => {
    // map에 정보 넣기
    IMessageUsersInfo.clear();
    const newUsersInfoMap: Map<number, IMessageUser> = new Map<
      number,
      IMessageUser
    >();
    usersInfo.forEach((elem: User) => {
      newUsersInfoMap.set(elem.userId, { _id: elem.userId, name: elem.name });
    });
    setIMessageUsersInfo(newUsersInfoMap);
  }, [isUserInfoLoading]);

  // 메시지 가져오기
  const { messages, sendNewMessageToServer, getNewMessagesFromSocket, onSend } =
    useMessage(chatroomId, userId, IMessageUsersInfo, socket);
  const [filteredMessages, setFilteredMessages] = useState<IMessage[]>([]);

  // TODO: 나중에 여기 socket 부분 분리.
  // TODO : 방 나갈 때 event 만들고 서버에서 받기.
  useEffect(() => {
    if (IMessageUsersInfo.size === 0) return;
    socket.on('connect', () => {
      console.log('--------------- room socket ---------------');
      console.log(chatroomId + ' socket connection 시작');

      socket.emit('client:joinChatroom', chatroomId);

      socket.on('server:hearMessage', (messageDto: IMessageDto) => {
        console.log(chatroomId + 'message 수신: ');
        console.log(messageDto);
        console.log(IMessageUsersInfo.get(messageDto.senderId));

        if (isEmpty(IMessageUsersInfo.get(messageDto.senderId)))
          new Error('서버에 문제가 발생했습니다.');
        getNewMessagesFromSocket([
          {
            _id: messageDto._id,
            text: messageDto.text,
            createdAt: messageDto.sendTime,
            user: IMessageUsersInfo.get(messageDto.senderId)!,
          },
        ]);
      });

      socket.on('disconnect', () => {
        console.log('--------------- room disconnected ---------------');
      });
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });

    // clean은 hooks에서 해 줌.
    return () => {
      socket.disconnect();
    };
  }, [socket, IMessageUsersInfo]);

  // backhandler (뒤로가기 버튼) action 지정
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Main', { screen: 'ChatroomList' });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // superior only filter
  useEffect(() => {
    async function f() {
      try {
        if (superiorOnly) {
          const superior = await api.get('/chatroom/commander/' + chatroomId);
          const filtered = messages.filter(
            msg => msg.user._id === superior.data.data.userId,
          );
          return setFilteredMessages(filtered);
        }
      } catch (e) {
        const filtered = messages.filter(msg => msg.user._id !== userId);
        setFilteredMessages(filtered);
        Alert.alert(
          '상급자 정보를 불러오지 못했습니다. 나의 메세지만 생략합니다.',
        );
        return;
      }
      setFilteredMessages(messages);
    }
    f();
  }, [superiorOnly, messages]);

  // 안 읽은 사람 목록 확인 가능한 icon
  const showReaderViewer = (props:any)=>{
    const {currentMessage} = props; // currentMessage type === IMessage. has _id, createdAt, text, user
    return (
      <>
        <View style = {styles.showReaderViewer}>
          <Pressable onPress={() => navigation.navigate("UnreadPeoples", {chatroomId: chatroomId, messageId: currentMessage._id})}>
            {currentMessage.user._id === userId ? <MaterialCommunityIcons name="eye-check-outline" size={18} color="white" />
            :<MaterialCommunityIcons name="eye-check-outline" size={18} color="black" />}
            
          </Pressable>
        </View>
      </>

    )
  };

  const mybubble = (props: any) => {
    const {currentMessage} = props;
    return (
      <View>
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: "#000"
          },
          right: {
            color: "#FFF",
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: "#E5B47F"
          },
          right: {
            backgroundColor: "#6A4035",
          }
        }}
       

      />
      <Text>{moment(currentMessage.createdAt).format("LT")}</Text>
      </View> //?////////////////////////////// TODO TODO TODO : 해야함.
    )
  };

  if(isUserInfoLoading || IMessageUsersInfo.size === 0) return (<></>);
  return (
    <>
      <ChatroomSide isOpen={isOpenSideMenu} setIsOpen={setIsOpenSideMenu} />  
      <SafeAreaView style={{ flex:0 }} />
      <ChatroomHeader
        onPressBack={() =>
          navigation.navigate('Main', { screen: 'ChatroomList' })
        }
        onPressSideMenu={() => setIsOpenSideMenu(true)}
        name={chatroomInfo?.name || ''}
      />
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300} // should be 0 for ios, but Platform.select not working currnetly.
      >
        <View style={styles.chat}>
          <GiftedChat
            messages={filteredMessages}
            onSend={(messages: any) => onSend(messages)}
            renderBubble={mybubble}
            timeTextStyle={{
              left: { color: 'black' },
              right: { color: 'white' },
            }}
            renderCustomView={showReaderViewer}
            isCustomViewBottom={true}
            //renderTime={()=>{return (<></>)}}
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
        onPressPin={() => {
          setSuperiorOnly(prev => {
            if (!prev) {
              // if superior only
              showMessage({
                message: '최상급자의 메세지만 표시됩니다.',
                type: 'info',
                backgroundColor: "#6A4035",
                color: "white",
                position: 'bottom',
              });
            }
            return !prev;
          });
        }}
        // onSend={onSendFromUser} // TODO: 로컬에서만 보내지니까 풀어줘도될듯? 테스팅해보고 풀어주기.
        onSend={() => {}}
      />
      <ChatroomTemplatePanel
        visible={templateVisible}
        setVisible={setTemplateVisible}
        setMsgInput={setMsgInput}
      />
      <SafeAreaView style={{ flex: 0, backgroundColor: 'white' }} />
      <FlashMessage position="top" />
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
  showReaderViewer:{
    display:"flex",
    flexDirection:"row-reverse",
    marginLeft: 9
  }
});
