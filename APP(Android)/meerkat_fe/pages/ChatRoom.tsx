import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import { RootStackParamList } from "../App";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import { io } from "socket.io-client";

import MKActions from "../components/ChatRoom/CustomChatComp/Actions";
import MKBubble from "../components/ChatRoom/CustomChatComp/Bubble";
import MKSend from "../components/ChatRoom/CustomChatComp/Send";

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, "Chat">;

interface RecvMessage {
  content: string,
}

const ChatRoom: React.FC<ChatScreenProps> = (props) => {
  const { navigation } = props;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [socket, setSocket] = useState(io("ws://code.exqt.me:5002"));
          
  useEffect(() => {
    socket.on('connect', () => {
      console.log("conneceted!");
    })

    socket.on('message', (msgStr: string) => {
      let msgJson: RecvMessage = JSON.parse(msgStr);
    
      setMessages((previousMessages) => {
        const sentMessages: IMessage[] = [
          { 
            _id: previousMessages.length + 1,
            createdAt: new Date(),
            text: msgJson.content,
            sent: true,
            received: true,
            user: {
              _id: 2,
              name: 'React Native',
            },
          }
        ];

        return GiftedChat.append(
          previousMessages,
          sentMessages,
        );
      })
    })

    socket.on('disconnect', () => {
      console.log("disconnected from server");
    })
  }, [socket]);
          
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
        createdAt: new Date(),
        quickReplies: {
          type: 'radio', // or 'checkbox',
          keepIt: true,
          values: [
            {
              title: '😋 Yes',
              value: 'yes',
            },
            {
              title: '📷 Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: '😞 Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
      {
        _id: 2,
        text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
        createdAt: new Date(),
        quickReplies: {
          type: 'checkbox', // or 'radio',
          values: [
            {
              title: 'Yes',
              value: 'yes',
            },
            {
              title: 'Yes, let me show you with a picture!',
              value: 'yes_picture',
            },
            {
              title: 'Nope. What?',
              value: 'no',
            },
          ],
        },
        user: {
          _id: 2,
          name: 'React Native',
        },
      }
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <View style={styles.chat}>
      <ChatRoomHeader onPressBack={() => navigation.goBack()}/>
      <GiftedChat
        messages={messages}
        onSend={(messages: any) => onSend(messages)}
        renderBubble={MKBubble}
        renderSend={MKSend}
        renderActions={MKActions}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    backgroundColor: "#DDD",
  },
})

export default ChatRoom;
