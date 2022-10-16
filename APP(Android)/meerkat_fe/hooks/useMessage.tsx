import { Alert } from 'react-native';
import { GiftedChat, IMessage, User as IMessageUser } from 'react-native-gifted-chat';
import { useEffect, useState, useCallback } from 'react';
import api from '../common/api';
import {
  ChatroomWithKey,
  Chatroom,
  IMessageDto,
  IMessageSendDto,
  RootStackScreenProps,
  User
} from '../common/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket } from 'socket.io-client';
import { decryptAES, decryptRSA, encryptAES } from '../common/crypto';
import { isEmpty } from '../common/isEmpty';

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
  IMessageUsersInfo: Map<number, IMessageUser>,
  socket: Socket,
) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  /**
   * 첫 메시지 가져오는 effect
   * 첫 메시지 때 모든 새로운 메시지를 asyncstorage에 저장.
   */
  useEffect(() => {
    if(IMessageUsersInfo.size === 0) return; // loading되지 않았다면 기다림
    async function init() {
      try {
        const cachedMessages = await fetchMessagesFromLocal();
        const newMessages = await fetchNewMessagesFromServer();
        setMessages([...cachedMessages, ...newMessages]);
        await saveNewMessagesToLocal(newMessages);
      } catch (err: any) {
        if (err.message !== undefined) {
          Alert.alert(err.message);
        } else {
          Alert.alert('알 수 없는 오류가 발생했습니다.'); //  TODO: 에러 메세지 잘 뜨는지 확인. try catch 잘되는지.
        }
      }
    }
    init();
  }, [chatroomId, IMessageUsersInfo]);

  /**
   * 새로온 메시지 가져오기.
   * @return 새로온 메시지.
   */
  const fetchNewMessagesFromServer = async () => {
    // 1. 서버에서 암호화된 메세지 가져오기
    let unreads: IMessage[] = [];
    try {
      const res = await api.get('/messages/unread/' + chatroomId);
      let result: IMessageDto[] = res.data.data;
      unreads = result.map((message:IMessageDto) => {
        return messageDto2IMessage(message);
      });
    } catch (err) {
      throw new Error('서버에서 메세지를 불러오지 못했습니다.');
    }

    if (unreads.length === 0) return [];

    // 2. unreads E2EE 복호화.
    try {
      const decryptedUnreads = await decryptMessages(unreads);
      return decryptedUnreads;
    } catch (err) {
      throw new Error('새로운 메세지 복호화에 실패했습니다.');
    }
  };

  /**
   * 로컬에 새로온 메시지 저장하기.
   * - TODO: 로컬에 저장할 때 방비번 asyncstorage에 존재하면 암호화해서 저장.
   * @param newMessages 이미 복호화된 메세지이어야함.
   */
  const saveNewMessagesToLocal = async (newMessages: IMessage[]) => {
    // 어디 까지 읽었는지 업데이트. TODO: 이 부분 테스팅.
    // 이 부분은 서버에서 설정해주는 것 보다 여기서 설정해주는 것이 더 깔끔함.
    try {
      if (newMessages.length > 0 ) {
        await api.post('/messages/setRecentRead', {
          chatroomId: chatroomId,
          recentMessageId: newMessages[newMessages.length - 1]._id,
        });
      }
    } catch (e) {
      throw new Error('서버와의 연결에 실패했습니다.');
    }

    try {
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
        return await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(newMsgList),
        );
      }
      // 로컬에 msg 정보가 있다면, append.
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify([...JSON.parse(msgList), ...newMsgList]), // 예전 메시지와 새 메시지 pointer들 합치기.
      );
    } catch (e) {
      throw new Error('새로온 메세지를 로컬에 저장하지 못했습니다.');
    }
  };

  /**
   * 로컬에서 메세지 가져오기.
   * 처음에만 로컬에서 가져오고, 그 다음부터는 로컬에는 저장만함.
   * - 여긴 일반 E2EE 적용 안해도 되는 곳임.
   * - TODO: 로컬에서 가져올때 현재 방의 방비번 asyncstorage에 존재하면 복호화해서 리턴.
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
   * - 복호화 후 로컬 저장과 onSend에 넣어준다.
   * @param message
   */
  const getNewMessagesFromSocket = async (message: IMessage[]) => {
    const decryptedMessage = await decryptMessages(message);
    try {
      onSend(decryptedMessage); //  새 메세지 오는 순간 append.
      saveNewMessagesToLocal(decryptedMessage); // 새 메세지 오는 순간 로컬로 저장.
    } catch (err: any) {
      if (err.message !== undefined) {
        Alert.alert(err.message);
      } else {
        Alert.alert('알 수 없는 오류가 발생했습니다.'); //  TODO: 에러 메세지 잘 뜨는지 확인. try catch 잘되는지.
      }
    }
  };

  /**
   * 내가 보낸 메세지 서버에 보내기.
   */
  const sendNewMessageToServer = async (text: string) => {
    const encryptedText = await encryptText(text) // 메세지 텍스트 암호화.
    if (encryptedText === undefined) return 
    // TODO : disconneted일 때 예외처리 해야 할 듯.
    if (socket.connected) {
      const messages: IMessageSendDto = {
        text: encryptedText,
        belongChatroomId: chatroomId,
        deleteTime: new Date(),
        sendTime: new Date(),
      };

      socket.emit('client:speakMessage', messages);
    }
  };

  /**
   * Gifted Chat에 UI상으로 message 붙여주는 함수.
   */
  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(messages, previousMessages),
    );
  }, []);

  /**
   * 메시지 가져오기 helper function
   */
  const messageDto2IMessage = (message: IMessageDto): IMessage => {
    if(isEmpty(IMessageUsersInfo.get(message.senderId))) new Error("서버에 문제가 발생했습니다.");
    return {
      _id: message._id,
      text: message.text,
      createdAt: message.sendTime,
      user: IMessageUsersInfo.get(message.senderId)!
    };
  };

  /**
   * 인자로 들어온 메세지들을 복호화하여 리턴합니다.
   *
   * 기본 라이프 사이클
   * => 로컬에서 복호화된 ChatroomKey 가져오기.
   * [=> 없으면 서버 ChatroomKey에서 열쇠 가져오기
   * => 로컬에서 PrivateKey 가져오기 (이건 로그인시 있는지 확인하기에 무조건 있음.)
   * => PrivateKey로 ChatroomKey 복호화 후 로컬에 저장]
   * => 복호화된 ChatroomKey로 처음 안읽은 unreads 메세지 복호화하고,
   * => 이후 소켓 메세지도 로컬에서 키 가져와서 복호화.
   */
  const decryptMessages = async (messages: IMessage[]) => {
    const chatroomKey = await AsyncStorage.getItem('chatroomKey' + chatroomId);
    // 로컬에 저장된 채팅룸키가 있다면 그거 쓰면됨.
    if (chatroomKey !== null) {
      return messages.map(message => {
        const decryptedText = decryptAES(message.text, chatroomKey);
        return { ...message, text: decryptedText };
      });
    }
    // 로컬에 저장된 채팅룸키가 없다면 가져와야함.
    try {
      const roomKey = await initAESKey()
      return messages.map(message => {
        const decryptedText = decryptAES(message.text, roomKey);
        return { ...message, text: decryptedText };
      });
    } catch (err) {
      throw new Error('메세지 복호화에 실패했습니다.');
    }
  };

  /**
   * 인자로 들어온 하나의 메세지 텍트트를 암호화하여 리턴합니다.
   * 양방향 AES 키는 방에 들어올 때 무조건 로컬에 저장하기 떄문에 존재해야합니다.
   */
  const encryptText = async (text: string) => {
    const chatroomKey = await AsyncStorage.getItem('chatroomKey' + chatroomId);
    if (chatroomKey !== null) {
      return encryptAES(text, chatroomKey)
    }
    // throw new Error('메세지를 암호화할 양방향 키가 없습니다.')
    // 로컬에 저장된 채팅룸키가 없다면 가져와야함.
    try {
      const roomKey = await initAESKey()
      const encryptedText = encryptAES(text, roomKey);
      return encryptedText
    } catch (err) {
      Alert.alert('메세지 암호화에 실패했습니다.')
    }
  };

  /**
   * 로컬에 방의 암호키가 없으면 서버에서 가져오기.
   */
   const initAESKey = async () => {
    try {
      const res = await api.get('/chatroom/getChatroomKey/' + chatroomId);
      const encryptedAESKey: string = res.data.data.encryptedKey; // aes키 가져오기
      const personalRSAKey = await AsyncStorage.getItem('PrivateKey'); // 개인 키 가져오기
      if (personalRSAKey === null) {
        throw new Error('개인키가 존재하지 않습니다.');
      }

      const decryptedAESKey = decryptRSA(encryptedAESKey, personalRSAKey); // 개인키로 aes 키 복호화
      if (decryptedAESKey === false) {
        throw new Error('방 암호키 복호화에 실패했습니다.')
      }
      await AsyncStorage.setItem('chatroomKey' + chatroomId, decryptedAESKey);
      return decryptedAESKey
    } catch(e) {
      throw new Error('서버에서 방 암호키를 가져오는 것을 실패하였습니다.')
    }
  }

  return {
    messages,
    setMessages,
    sendNewMessageToServer,
    getNewMessagesFromSocket,
    onSend,
  };
}