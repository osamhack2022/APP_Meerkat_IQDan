// core
import { useEffect, useState, useContext, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
// thirds
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptMKE, hashMD5 } from '../../common/crypto';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IMessage } from 'react-native-gifted-chat';

export const PasswordSettingPrompt = (props: {
  visible: boolean;
  roomId: number;
  onClose: () => void;
}) => {
  let [pw, setPw] = useState('');
  let ref = useRef<TextInput>(null);

  // 2차 비번 해싱해서 저장
  const apply2ndPassword = async () => {
    if (pw == '') return;
    let hash = hashMD5(pw);
    await AsyncStorage.setItem('2ndPassword-' + props.roomId.toString(), hash);
    encryptLocalMesssages(props.roomId.toString())
    props.onClose();
  };

  // 해당 방에 대하여  로컬에 저장된 메시지 암호화
  const encryptLocalMesssages = async (chatroomId: string) => {
    const messages = await getLocalMesssages(chatroomId)
    await Promise.all(messages.map((m: IMessage) => {
      const encryptedMessage = {...m, text: encryptMKE(m.text, pw)} // 2차 비번으로 메시지 암호화
      return AsyncStorage.setItem('message' + m._id, JSON.stringify(encryptedMessage)) // 암호화된 메시지 저장
    }))
  }

  // 해당 방에 대하여 로컬에 저장된 메시지 가져오기
  const getLocalMesssages = async (chatroomId: string) => {
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

    // null인 메세지 모두 거르기.
    const nullFiltered = newIMessages.filter(m => m !== null);
    const res = nullFiltered.map(message => {
      return JSON.parse(message) as IMessage;
    });

    return res
  }

  useEffect(() => {
    if (!props.visible) return;
    setPw('');
    setTimeout(() => { ref.current?.focus(); }, 100);
  }, [props.visible]);

  if (!props.visible) return <></>

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>2차 비밀번호 설정</Text>
        <Text style={styles.msg}>방을 2차 비밀번호로 암호화하여</Text>
        <Text style={styles.msg}>보안을 강화합니다.</Text>
        <TextInput secureTextEntry={true} style={styles.textInput} ref={ref} value={pw} onChangeText={setPw} />
        
        <View style={{flexDirection: "row", width: "100%", justifyContent: "space-around", marginTop: 12}}>
          <TouchableOpacity onPress={props.onClose}>
            <Text style={styles.button}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={apply2ndPassword}>
            <Text style={styles.button}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const OpenChatPrompt = (props: {
  visible: boolean;
  roomId: number;
  onClose: () => void;
  onVerify: (pw: string) => void;
}) => {
  let [pw, setPw] = useState('');
  let ref = useRef<TextInput>(null);

  const confirm = async () => {
    if (pw == '') return;
    let hash = hashMD5(pw);
    let roomKey = '2ndPassword-' + props.roomId.toString();
    let roomHash = await AsyncStorage.getItem(roomKey);
    
    if (hash !== roomHash) {
      console.log(roomKey, hash, roomHash);
      Alert.alert("비밀번호가 틀렸습니다.")
      props.onClose();
      return;
    }
    
    props.onVerify(pw);
    props.onClose();
  };

  useEffect(() => {
    if (!props.visible) return;
    setPw('');
    setTimeout(() => { ref.current?.focus(); }, 100);
  }, [props.visible]);

  if (!props.visible) return <></>

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>보안방</Text>
        <Text style={styles.msg}>2차 비밀번호를 입력해야 볼 수 있습니다.</Text>
        <TextInput secureTextEntry={true} style={styles.textInput} ref={ref} value={pw} onChangeText={setPw} />
        
        <View style={{flexDirection: "row", width: "100%", justifyContent: "space-around", marginTop: 12}}>
          <TouchableOpacity onPress={props.onClose}>
            <Text style={styles.button}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={confirm}>
            <Text style={styles.button}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(80, 80, 80, 0.8)',
  },
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 230,
    width: '80%',
    backgroundColor: '#6A4035',
    borderRadius: 20,
  },
  
  title: {
    fontSize: 25,
    fontFamily: 'noto-bold',
    lineHeight: 45,
    color: "#FFF9D2" 
  },
  msg: {
    fontSize: 14,
    color: "#FFF9D2" 
  },

  textInput: {
    fontSize: 18,
    backgroundColor: "#FFF9D2",
    width: "80%",
    marginVertical: 12,
    borderRadius: 8,
    padding: 4
  },

  button: {
    fontSize: 18,
    color: "#FFF9D2",
  }
});
