import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { ChatroomWithKey } from '../common/types';

export default function useRemoveMessage(
  messages: IMessage[],
  setMessages: Function,
  chatroomInfo: ChatroomWithKey | null,
  setRemoveCountdown: Function,
) {
  const [timeoutOn, setTimeoutOn] = useState(false) 

  useEffect(() => {
    if (timeoutOn) return;
    // console.log('inside useeffect', messages)
    if (messages.length === 0) return;
    if (chatroomInfo === null) return;
    if (chatroomInfo.removeType === 'FROMEARTH') {
      setTimeoutOn(true)
      initiateTimer();
    }
  }, [messages, chatroomInfo]);
  
  /**
   * sets settimeout for removing next messages.
   */
  const initiateTimer = async () => {
    removeOldMessages()
  };

  /**
   * remove old messages from UI AND AsyncStorage
   * @param messages
   */
  const removeOldMessages = async () => {
    
    // remove from ui
    setMessages((prev: IMessage[]) => {
      const res = prev.filter((message) => {
        const createdDate = new Date(message.createdAt);
        if (new Date().getTime() > createdDate.getTime() + chatroomInfo!.msgExpTime*1000) {
          console.log('remove!')
          AsyncStorage.removeItem('message' + message._id);
          return false;
        }
        return true;
      })

      reloadRemoval(res)
      return res
    });
  };

  const reloadRemoval = async (messages: IMessage[]) => {
    if (messages.length === 0) {
      setTimeoutOn(false)
      setRemoveCountdown(null)
      return;
    }
    const crDate = new Date(messages[0].createdAt);
    let secDiff = (crDate.getTime() + chatroomInfo!.msgExpTime*1000) - new Date().getTime(); 
    setRemoveCountdown(secDiff);
    // 메세지 없으면 끝내기.
    setTimeout(() => {
      if (messages.length === 0) {
        setTimeoutOn(false)
        setRemoveCountdown(null)
      } else {
        removeOldMessages()
      }
    }, secDiff);
  };

  /**
   * save filtered messages' pointers
   * @deprecated this is moved to useMessage
   * @param messages
   */
  const setNewPointers = async (messages: IMessage[]) => {
    const newMessagePointers = messages.map(message => {
      return message._id;
    });
    // this function is never called if chatroomInfo is null
    await AsyncStorage.setItem(
      'message' + chatroomInfo!.chatroomId + 'pointers',
      JSON.stringify(newMessagePointers),
    );
  };

  return {};
}
