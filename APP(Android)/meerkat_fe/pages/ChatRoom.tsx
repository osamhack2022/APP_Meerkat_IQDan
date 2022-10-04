import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useCallback, useEffect, Fragment } from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Platform, KeyboardAvoidingView, TextInput } from "react-native";
import { Bubble, Composer, GiftedChat, IMessage } from "react-native-gifted-chat";
import { RootStackParamList } from "../App";
import ChatRoomHeader from "../components/ChatRoom/ChatRoomHeader";
import { io } from "socket.io-client";

import MKBubble from "../components/ChatRoom/CustomChatComp/Bubble";
import ChatRoomSide from "../components/ChatRoom/ChatRoomSide";
import ChatRoomAccessoryBar from "../components/ChatRoom/ChatRoomAccessoryBar";
import ChatRoomTextInput from "../components/ChatRoom/ChatRoomTextInput";
import ChatRoomTemplatePanel from "../components/ChatRoom/ChatRoomTemplatePanel";

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
  const [templateVisible, setTemplateVisible] = useState(false);
  const [superiorOnly, setSuperiorOnly] = useState(false);
  const [msgInput, setMsgInput] = useState("");
          
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

  const sendTextMessage = (text: string) => {
    onSend([{
      text: text,
      user: user,
      createdAt: new Date(),
      _id: messages.length + 1,
    }])
  }

  // https://stackoverflow.com/questions/47725607/react-native-safeareaview-background-color-how-to-assign-two-different-backgro
  return (
    <Fragment>
      <ChatRoomSide isOpen={isOpenSideMenu} setIsOpen={setIsOpenSideMenu} />
      <SafeAreaView style={{ flex:0, backgroundColor: headerColor }} />
      <ChatRoomHeader
        color={headerColor}
        onPressBack={() => navigation.goBack()}
        onPressSideMenu={() => setIsOpenSideMenu(true)}
      />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: "#EEE" }}>
        <View style={styles.chat}>
          <GiftedChat
            messages={messages}
            onSend={(messages: any) => onSend(messages)}
            renderBubble={MKBubble}
            timeTextStyle={{ left: { color: 'black' }, right: { color: 'white' } }}
            user={{ _id: 1, }}
            wrapInSafeArea={false}
            isKeyboardInternallyHandled={false}
            renderInputToolbar={() => null}
            maxComposerHeight={0}
            minInputToolbarHeight={0}
          />
          <ChatRoomTextInput 
            msgInput={msgInput}
            setMsgInput={setMsgInput}
            onSendTextMessage={(text) => sendTextMessage(text)} 
          />
        </View>
      </KeyboardAvoidingView>
      <ChatRoomAccessoryBar
        superiorOnly={superiorOnly}
        onPressTemplate={() => setTemplateVisible(true)}
        onPressSuperiorSwitch={() => setSuperiorOnly(!superiorOnly)}
        onSend={onSendFromUser}
      />
      <ChatRoomTemplatePanel
        visible={templateVisible}
        setVisible={setTemplateVisible}
        setMsgInput={setMsgInput}
      />
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
