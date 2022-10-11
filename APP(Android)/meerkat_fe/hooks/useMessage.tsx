import {Alert } from 'react-native'
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useEffect, useState, useCallback } from 'react';
import api from '../common/api';
import {
  ChatroomWithKey,
  Chatroom,
  IMessageDto,
  IMessageSendDto,
  RootStackScreenProps,
  User,
} from '../common/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket } from 'socket.io-client';

/**
 * Message 라이프 사이클
 * 동번호는 동시 진행.
 * 1. async storage에서 과거 메시지를 가져옴. (일단 개수 20개로 한정.)
*     1번이 끝난 후에는, async에서는 불러오지 않고 저장만해줌.
 * 2. Message unread를 서버에서 가져옴.
 * 3. unread message를 로컬에 저장해줌.
 * 4. 새 메세지는 오는 순간 local로 저장.
 * 4. 새 메세지는 오는 순간 setMessage로 append.
 * 
 * @param chatroomId 
 * @param userId 
 * @param socket 
 * @returns 
 */
export default function useMessage(chatroomId: number, userId: number, socket: Socket) {
  const [messages, setMessages] = useState<IMessage[]>([]);

  console.log(messages)

  /**
   * 첫 메시지 가져오는 effect
   * 첫 메시지 때 모든 새로운 메시지를 asyncstorage에 저장.
   */
  useEffect(() => {
    async function init() {
        console.log("init")
        const cachedMessages = await fetchMessagesFromLocal()
        const newMessages = await fetchNewMessagesFromServer()

        console.log("cached", cachedMessages)
        console.log("new", newMessages)

        setMessages([...cachedMessages, ...newMessages])
        await saveNewMessagesToLocal(newMessages)
    }
    init()
  }, [chatroomId]);

  /**
   * 새로온 메시지 가져오기.
   * @return 새로온 메시지.
   */
  const fetchNewMessagesFromServer = async () => {
    try {
        const res = await api.get('/messages/unread/' + chatroomId);
        let result: IMessageDto[] = res.data.data;
        const unreads: IMessage[] = result.map(message => {
            return messageDto2IMessage(message);
        });
        return unreads;
    } catch (err) {
        Alert.alert('서버에서 메시지를 불러오지 못했습니다.')
        return []
    }
  };

  /**
   * 로컬에 새로온 메시지 저장하기.
   */
  const saveNewMessagesToLocal = async (newMessages: IMessage[]) => {
    await Promise.all(
      newMessages.map(message => {
        return AsyncStorage.setItem(
          'message' + message._id.toString(),
          JSON.stringify(message),
        );
      }),
    );
    const storageKey = 'chatroom' + chatroomId + 'pointers';
    const newMsgList = newMessages.map(message => message._id);
    const msgList = await AsyncStorage.getItem(storageKey);
    // 로컬에 msg 정보가 없다면, 생성.
    if (msgList === null) {
      return await AsyncStorage.setItem(storageKey, JSON.stringify(newMsgList));
    }
    // 로컬에 msg 정보가 있다면, append.
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify([...JSON.parse(msgList), ...newMsgList]), // 예전 메시지와 새 메시지 pointer들 합치기.
    );
  };

  /**
   * 로컬에서 메시지 가져오기.
   * 처음에만 로컬에서 가져오고, 그 다음부터는 로컬에는 저장만함.
   */
  const fetchMessagesFromLocal = async () => {
    const messagePointers = await AsyncStorage.getItem('chatroom' + chatroomId + 'pointers')
    if (messagePointers === null) {
        // 로컬에 저장된 메시지가 없다면 빈 리스트 리턴.
        return [];
    }
    const newIMessages: IMessage[] = await Promise.all(JSON.parse(messagePointers).map((pointer: number) => {
        return AsyncStorage.getItem('message' + pointer) // pointer is alias for messageId or _id.
    }))

    return newIMessages
  };


  /**
   * 소켓에서 새로운 메세지 받아오기.
   * @param message 
   */
  const getNewMessagesFromSocket = async (message: IMessage[]) => {
        saveNewMessagesToLocal(message) // 새 메세지 오는 순간 로컬로 저장.
        onSend(message) //  새 메세지 오는 순간 append.
    }

  /**
   * 내가 보낸 메시지 서버에 보내기.
   */
  const sendNewMessageToServer = (text: string) => {
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

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(messages, previousMessages),
    );
  }, []);


  // me
  const user = {
    _id: userId,
    name: 'Developer',
  };

  // other user
  const otherUser = {
    _id: 2,
    name: 'React Native',
    avatar: require('../assets/users/emptyProfile.jpg'),
  };
  /**
   * 메시지 가져오기 helper function
   * @param message
   * @returns
   */
  const messageDto2IMessage = (message: any): IMessage => {
    return {
      _id: message._id,
      text: message.text,
      createdAt: message.sendTime,
      user: message.isSender ? user : otherUser,
      // TODO : sender가 아닌 경우 해당 user로 fetch해야 함.
    };
  };

  return { messages, setMessages, sendNewMessageToServer, getNewMessagesFromSocket, onSend };
}
