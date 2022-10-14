import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import { Chatroom } from '../../common/types';
import { MaterialIcons } from "@expo/vector-icons"; 

const dotsImage = require('../../assets/icons/dots_vertical.png');

export default function ChatroomBox(props: any) {
  // TODO: Chatroom + navigation으로 수정
  const {
    chatroomId,
    name,
    type,
    createDate,
    updateDate,
    msgExpTime,
    unreadCount,
    navigation,
    onPress2ndPwSetting
  } = props;

  const [encrypted, setEncrpyted] = useState(false);

  useEffect(() => {
    (async () => {
      let e = await AsyncStorage.getItem("2ndPassword-" + chatroomId);
      if (e) setEncrpyted(true);
    })();
  })

  // socket context에 있는 socket 받아와서
  // chatroomId에 해당하는 room으로 join

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.push('Chat', { chatroomId: chatroomId });
      }}
    >
      <View style={styles.upperContainer}>
        <Text style={styles.title}>{name}</Text>
        {
          encrypted ?
            <MaterialIcons size={28} color="white" name="lock" />
            :
            <TouchableOpacity onPress={onPress2ndPwSetting}>
              <MaterialIcons size={28} color="white" name="lock-open" />
            </TouchableOpacity>
        }
      </View>
      <View style={styles.lowerContainer}>
        <Text style={styles.time}>마지막 대화 1시간 전</Text>
        <Text style={styles.count}>{unreadCount}</Text>
      </View>
    </TouchableOpacity>
  );
}
// #6A4035
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 10,
    height: 130,
    backgroundColor: '#E5B47F',
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  upperContainer: {
    // backgroundColor: "black",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  lowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
  },
  title: {
    color: 'white',
    fontFamily: 'noto-bold',
    fontSize: 20,
    width: 130,
    lineHeight: 30,
  },
  dots: {
    tintColor: 'white',
    marginTop: 8,
    marginRight: 8,
  },
  time: {
    color: 'white',
    fontFamily: 'noto-med',
    fontSize: 10,
  },
  count: {
    fontFamily: 'noto-med',
    color: 'white',
    lineHeight: 20,
    backgroundColor: '#6A4035',
    marginRight: 8,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 10,
  },
});
