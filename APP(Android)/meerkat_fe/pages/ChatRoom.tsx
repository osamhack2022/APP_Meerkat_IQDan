import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useCallback, useEffect, Fragment } from "react";
import { View, StyleSheet, Text, SafeAreaView, Platform } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import { RootStackParamList } from "../App";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import { io } from "socket.io-client";

import MKBubble from "../components/ChatRoom/CustomChatComp/Bubble";
import MKSend from "../components/ChatRoom/CustomChatComp/Send";
import ChatRoomSide from "../components/ChatRoom/ChatRoomSide";
import ChatRoomAccessoryBar from "../components/ChatRoom/ChatRoomAccessoryBar";

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, "Chat">;

interface RecvMessage {
  content: string,
}

const user = {
  _id: 1,
  name: 'Developer',
}

const otherUser = {
  _id: 2,
  name: 'React Native',
  avatar: 'https://facebook.github.io/react/img/logo_og.png',
}

const headerColor = "#DDD";

const ChatRoom: React.FC<ChatScreenProps> = (props) => {
  const { navigation } = props;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [socket, setSocket] = useState(io("ws://code.exqt.me:5002"));
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
          
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
            user: otherUser,
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
        user: otherUser,
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
        user: otherUser,
      }
    ]);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages: IMessage[]) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const onSendFromUser = (msg: IMessage[] = []) => {
    const createdAt = new Date()
    const messagesToUpload = msg.map(message => ({
      ...message,
      user,
      createdAt,
      _id: messages.length + 1,
    }))
    onSend(messagesToUpload);
  }

  // https://stackoverflow.com/questions/47725607/react-native-safeareaview-background-color-how-to-assign-two-different-backgro
  return (
    <Fragment>
      {isOpenSideMenu ? <ChatRoomSide onClickOutside={() => setIsOpenSideMenu(false)} /> : null}
      <SafeAreaView style={{ flex:0, backgroundColor: headerColor }} />
      <View style={{ flex: 1, backgroundColor: "pink" }}>
        <View style={styles.chat}>
          <ChatRoomHeader
            color={headerColor}
            onPressBack={() => navigation.goBack()}
            onPressSideMenu={() => setIsOpenSideMenu(!isOpenSideMenu)}
          />
          <SafeAreaView style={{ flex: 1 }}>
            <GiftedChat
              messages={messages}
              onSend={(messages: any) => onSend(messages)}
              renderBubble={MKBubble}
              renderSend={MKSend}
              timeTextStyle={{ left: { color: 'black' }, right: { color: 'white' } }}
              user={{ _id: 1, }}
              wrapInSafeArea={false}
              bottomOffset={Platform.OS == "ios" ? 77 : 0}
              textInputProps={{placeholder: "메세지를 입력하세요"}}
              // @ts-ignore
              textInputStyle={{backgroundColor: "#EAEAEA", borderRadius: 8, marginRight: 11, fontSize: 16, paddingLeft: 12, paddingTop: 10 }}
            />
            <ChatRoomAccessoryBar onSend={onSendFromUser} />
          </SafeAreaView>
        </View>
      </View>
      <SafeAreaView style={{ flex:0, backgroundColor: 'white' }} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  chat: {
    flex: 1,
    backgroundColor: "#EEE",
    position: "absolute",
    width: "100%",
    height: "100%"
  },
})

export default ChatRoom;
