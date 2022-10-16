import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { ChatroomWithKey } from '../common/types';

export default function useRemoveMessage(
  messages: IMessage[],
  setMessages: Function,
  chatroomInfo: ChatroomWithKey | null,
  removeCountdown: number,
  setRemoveCountdown: Function,
) {

  useEffect(() => {
    if (messages.length === 0) return;
    if (chatroomInfo === null) return;
    console.log(chatroomInfo.removeType)
    if (chatroomInfo.removeType === 'FROMEARTH') {
      initiateTimer();
    }
  }, [messages, chatroomInfo]);

  /**
   * sets settimeout for removing next messages.
   */
  const initiateTimer = () => {
    console.log("아아", messages)
    // setTimeout(() => {
        // if(chatroomInfo === null) return;
    // }, )
  };



  /**
   * remove old messages from UI AND AsyncStorage
   * @param messages 
   */
  const removeOldMessages = (messages: IMessage[]) => {
    const garbage: number[] = []

    // filter out old messages
    const cleaned = messages.filter((message) => {
        const createdDate = new Date(message.createdAt)
        // this function is never called if chatroomInfo is null
        createdDate.setSeconds(createdDate.getSeconds() + chatroomInfo!.msgExpTime) // add expiry
        if (new Date() > createdDate) {
            garbage.push(Number(message._id))
            return false
        }
        return true
    })

    // remove from ui
    setMessages(cleaned);
    setNewPointers(cleaned)
    // remove from async storage
    garbage.map((g) => {
        AsyncStorage.removeItem('message' + g);
    })
  };

  /**
   * save filtered messages' pointers
   * @param messages
   */
  const setNewPointers = async (messages: IMessage[]) => {
    const newMessagePointers = messages.map((message) => {
        return message._id
    })
    // this function is never called if chatroomInfo is null
    await AsyncStorage.setItem('message' + chatroomInfo!.chatroomId + "pointers", JSON.stringify(newMessagePointers))
  }

  return {};
}
