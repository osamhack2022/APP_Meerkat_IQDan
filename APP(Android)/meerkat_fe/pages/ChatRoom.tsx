import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import { RootStackParamList } from "../App";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";

import MKBubble from "../components/ChatRoom/CustomChatComp/Bubble";

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, "Chat">;

const BackButton = (props: {onPress: () => void}) => {
  return (
    <View>
      <Text onPress={props.onPress}>back</Text>
    </View>
  )
}

const Title = (props: {}) => {
  return (
    <View>
      <Text>{"본부대대 1중대"}</Text>
    </View>
  )
}

const Menu = (props: {}) => {
  return (
    <View>
      <Text>{'☰'}</Text>
    </View>
  )
}

const ChatRoom: React.FC<ChatScreenProps> = (props) => {
  const { navigation } = props;
  const [messages, setMessages] = useState<IMessage[]>([]);
          
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={() => navigation.goBack() }/>,
      headerTitle: () => <Title/>,
      headerRight: () => <Menu/>
    })
  })

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
        <GiftedChat
          messages={messages}
          onSend={(messages: any) => onSend(messages)}
          renderBubble={MKBubble}
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
