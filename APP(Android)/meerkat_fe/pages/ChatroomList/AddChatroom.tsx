import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Chatroom, RootStackScreenProps } from '../../common/types';
import { useEffect, useState } from 'react';
import api from '../../common/api';
import Select from './Select';
import SelectFriends from './SelectFriends';
import { decryptRSA, encryptRSA, generateAESKey } from '../../common/crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddChatroom(
  props: RootStackScreenProps<'AddChatroom'>,
) {
  const { navigation } = props;

  const [isSubmitActive, setIsSubmitActive] = useState(true);
  const [selectedFriends, setSelectedFrineds] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [msgExpTime, setMsgExpTime] = useState(3600 * 24 * 30);
  const [readOption, setReadOption] = useState<'하고' | '안해도'>('하고');
  const [expTimeOption, setExpTimeOption] = useState<
    '한달' | '하루' | '한시간' | '일분' | '십초'
  >('하루');
  const [removeType, setRemoveType] = useState<"서버" | "지구상">("서버")
  const [closeFlag, setCloseFlag] = useState(true);

  useEffect(() => {
    switch (expTimeOption) {
      case '한달': {
        setMsgExpTime(3600 * 24 * 30);
      }
      case '하루': {
        setMsgExpTime(3600 * 24);
      }
      case '한시간': {
        setMsgExpTime(3600);
      }
      case '일분': {
        setMsgExpTime(60);
      }
      case '십초': {
        setMsgExpTime(10);
      }
    }
  }, [expTimeOption]);

  const handleClose = (closeFlag: boolean) => {
    setCloseFlag(!closeFlag);
  };

  const getRemoveType = () => {
    if (removeType === "서버") return "FROMSERVER"
    return "FROMEARTH"
  }

  const handleSubmit = async () => {
    disableSubmit()
    if (name === '') {
      enableSubmit()
      return Alert.alert('초대방 이름을 정해주세요.');
    }

    let createdChatroomId: number = 0
    console.log('asdfsadfsadf')
    try {
      let me = (await api.get("/users/me")).data.data;
      let res = await api.post('/chatroom/create', {
        name: name,
        msgExpTime: msgExpTime,
        removeAfterRead: readOption === '하고',
        removeType: getRemoveType(),
        commanderUserIds: [],
        targetUserIds: selectedFriends
      })
      console.log(res.data.data)
      createdChatroomId = res.data.data.chatroomId

      if (res.data.data.alreadyExists) {
        enableSubmit()
        return Alert.alert('이미 존재하는 1대1 채팅방입니다.')
      }
      

      let chatroomId = res.data.data.chatroomId;
      // 대칭키 생성
      let roomkey = generateAESKey();

      let targetUsers = selectedFriends.slice();
      targetUsers.push(me.userId);

      // 모든 유저 공개키 가져오기
      let getPublicKeyTasks = [];
      for (let i=0; i<targetUsers.length; i++) {
        let id = targetUsers[i];
        getPublicKeyTasks.push(api.get(`users/publicKey/${id}`));
      }
      let publicKeysRes = await Promise.all(getPublicKeyTasks);
      let publicKeys = publicKeysRes.map((r) => r.data.data.key);
      let encryptedKeys = publicKeys.map((pkey) => encryptRSA(roomkey, pkey));
      
      // 공개키로 룸키(대칭키) 를 암호화 한 후 유저들에게 전송
      let putChatroomKeyTasks = [];
      for (let i=0; i<targetUsers.length; i++) {
        let id = targetUsers[i];
        putChatroomKeyTasks.push(
          api.post("/chatroom/chatroomKey", {
            forUserId: id,
            forChatroomId: chatroomId,
            encryptedKey: encryptedKeys[i]
          })
        )
      }
      await Promise.all(putChatroomKeyTasks);

      navigation.navigate("Chat", {chatroomId})
    }
    catch (e) {
      enableSubmit()
      Alert.alert('채팅방 개설에 실패했습니다. 다른 유저가 키 발행을 완료했는지 확인하세요.')
      if (createdChatroomId !== 0) {
        api.get("/chatroom/removeChat/" + createdChatroomId) // 채팅방 삭제.
      }
    }
  };

  const enableSubmit = () => {
    setIsSubmitActive(true)
  }

  const disableSubmit = () => {
    setIsSubmitActive(false)
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handleClose(closeFlag)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="chevron-back"
              size={24}
              color="black"
            />
            대화방 추가하기
          </Text>
        </View>
        {/* 채팅방 이름, 채팅방 메시지 삭제 시간 설정 */}
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle2}>대화방 이름</Text>
          <TextInput
            style={styles.subTitleInput}
            onChangeText={setName}
            value={name}
          />
        </View>
        <View style={[styles.subTitleContainer]}>
          <Text style={styles.subTitle2}>모두가 확인</Text>
          <Select
            allValues={['하고', '안해도']}
            currValue={readOption}
            setCurrValue={setReadOption}
            closeFlag={closeFlag}
            zIndex={200}
          />
          <Select
            allValues={['한달', '하루', '한시간', '일분', '십초']}
            currValue={expTimeOption}
            setCurrValue={setExpTimeOption}
            closeFlag={closeFlag}
            zIndex={200}
          />
        </View>
        <View style={[styles.subTitleContainer]}>
          <Text style={[styles.subTitle2, {marginRight: 10}]}>
            이후 메시지가
          </Text>
          <Select
            allValues={['서버', '지구상']}
            currValue={removeType}
            setCurrValue={setRemoveType}
            closeFlag={closeFlag}
            zIndex={199}
          />
          <Text style={[styles.subTitle2, {marginLeft: -15}]}>
            에서 삭제됩니다.
          </Text>
        </View>
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitle2}>초대할 전우를 선택해주세요.</Text>
        </View>
      </Pressable>

      {/* 친구 목록 */}
      <SelectFriends
        selectedFriends={selectedFriends}
        setSelectedFriends={setSelectedFrineds}
      />
      <View style={{ alignItems: 'center' }}>
        <Button onPress={handleSubmit} disabled={!isSubmitActive} title="추가하기" color="#6A4035" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    fontFamily: 'noto-bold',
    lineHeight: 45,
  },
  subTitleContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontFamily: 'noto-bold',
    lineHeight: 40,
    marginRight: 20,
  },
  subTitle2: {
    fontSize: 18,
    fontFamily: 'noto-bold',
    lineHeight: 30,
    marginRight: 20,
    marginBottom: 10,
  },
  smallText: {
    fontSize: 14,
    fontFamily: 'noto-bold',
  },
  radio: {
    flexDirection: 'row',
  },
  subTitleInput: {
    width: 250,
    borderBottomWidth: 1,
    fontFamily: 'noto-bold',
    fontSize: 15,
    lineHeight: 20,
    height: 30,
  },
});
