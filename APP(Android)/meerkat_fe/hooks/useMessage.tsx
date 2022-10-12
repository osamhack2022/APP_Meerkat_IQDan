import { Alert } from 'react-native';
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

// json stringify helper function (escape 문자 제거)
function replacer(key: any, value: string) {
  return value.replace(/[^\w\s]/gi, '');
}

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
export default function useMessage(
  chatroomId: number,
  userId: number,
  socket: Socket,
) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  /**
   * 첫 메시지 가져오는 effect
   * 첫 메시지 때 모든 새로운 메시지를 asyncstorage에 저장.
   */
  useEffect(() => {
    async function init() {
      const cachedMessages = await fetchMessagesFromLocal();
      const newMessages = await fetchNewMessagesFromServer();

      // console.log('cached', cachedMessages);
      // console.log('new', newMessages);

      // 데이터 게워내기
      // for (let i = 0; i < 100; i++) {
        // await AsyncStorage.removeItem("message" + i) 
        // await AsyncStorage.removeItem("chatroom" + i + "pointers")
      // }

      setMessages([...cachedMessages, ...newMessages])
      await saveNewMessagesToLocal(newMessages)
    }
    init();
  }, [chatroomId]);

  /**
   * 새로온 메시지 가져오기.
   * - 여기서 E2EE 메세지 내용 복호화하기.
   * => 로컬에서 복호화된 ChatroomKey 가져오기.
   * [=> 없으면 서버 ChatroomKey에서 열쇠 가져오기
   * => 로컬에서 PrivateKey 가져오기 (이건 로그인시 있는지 확인하기에 무조건 있음.)
   * => PrivateKey로 ChatroomKey 복호화 후 로컬에 저장]
   * => 복호화된 ChatroomKey로 처음 메세지 복호화하고,
   * => 이후 소켓 메세지도 로컬에서 키 가져와서 복호화.
   * @return 새로온 메시지.
   */
  const fetchNewMessagesFromServer = async () => {
    let flag = 1;
    try {
      const res = await api.get('/messages/unread/' + chatroomId);
      let result: IMessageDto[] = res.data.data;
      const unreads: IMessage[] = result.map(message => {
        return messageDto2IMessage(message);
      });

      if (unreads.length === 0) {
        return unreads
      }
      flag = 2;
      // 최근 읽은 메세지 업데이트.
      await api.post('/messages/setRecentRead', {
        chatroomId: chatroomId,
        recentMessageId: unreads[unreads.length - 1]._id,
      });

      return unreads;
    } catch (err) {
      if (flag === 1) {
        Alert.alert('서버에서 메시지를 불러오지 못했습니다.');
      } else {
        Alert.alert(
          '서버에 어디까지 읽었는지 보내지 못했습니다. 치명적인 오류입니다.',
        );
      }
      return [];
    }
  };

  /**
   * 로컬에 새로온 메시지 저장하기.
   * - 여긴 일반 E2EE 적용 안해도 되는 곳임.
   * - 여긴 비밀방일 때만 양방향 비밀번호로 암호화.
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
   * - 여긴 일반 E2EE 적용 안해도 되는 곳임.
   * - 여긴 비밀방일 때만 양방향 비밀번호로 복호화
   */
  const fetchMessagesFromLocal = async () => {
    const messagePointers = await AsyncStorage.getItem(
      'chatroom' + chatroomId + 'pointers',
    );
    if (messagePointers === null) {
      // 로컬에 저장된 메시지가 없다면 빈 리스트 리턴.
      return [];
    }
    const newIMessages: string[] = await Promise.all(
      JSON.parse(messagePointers).map((pointer: number) => {
        return AsyncStorage.getItem('message' + pointer); // pointer is alias for messageId or _id.
      }),
    );

    return newIMessages.map(message => {
      return JSON.parse(message) as IMessage;
    });
  };

  /**
   * 소켓에서 새로운 메세지 받아오기.
   * - 채팅방 들어올 때 로컬에 복호화한 ChatroomKey 가져와서 새 메세지도 복호화하기.
   * - 복호화 후 로컬 저장과 onSend에 넣어준다.
   * @param message
   */
  const getNewMessagesFromSocket = async (message: IMessage[]) => {
    saveNewMessagesToLocal(message); // 새 메세지 오는 순간 로컬로 저장.
    onSend(message); //  새 메세지 오는 순간 append.
  };

  /**
   * 내가 보낸 메시지 서버에 보내기.
   * - 채팅방 들어올 때 로컬에 복호화한 ChatroomKey로 text 암호화하고 보내기.
   */
  const sendNewMessageToServer = (text: string) => {
    // TODO : disconneted일 때 예외처리 해야 할 듯.
    if (socket.connected) {
      const IMessageSendDto: IMessageSendDto = {
        text: text,
        belongChatroomId: chatroomId,
        deleteTime: new Date(),
        sendTime: new Date(),
      };
      socket.emit('speakMessage', IMessageSendDto);
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

  return {
    messages,
    setMessages,
    sendNewMessageToServer,
    getNewMessagesFromSocket,
    onSend,
  };
}
