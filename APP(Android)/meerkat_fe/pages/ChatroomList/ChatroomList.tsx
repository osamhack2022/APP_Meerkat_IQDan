// core
import { useEffect, useState, useContext, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput
} from 'react-native';
// comps
import Searchbar from '../../components/ChatroomList/Searchbar';
import ChatroomBox from '../../components/ChatroomList/ChatroomBox';
import ChatroomLoading from '../../components/ChatroomList/ChatroomLoading';
import useDoubleFetchAndSave from '../../hooks/useDoubleFetchAndSave';
// types
import { ChatroomUnread, MainTabScreenProps } from '../../common/types';
import Header from '../../components/FriendList/Header';
import { SocketContext } from '../../common/Context';
// thirds
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Dialog from 'react-native-dialog';
import { hashMD5 } from '../../common/crypto';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PasswordSettingPrompt = (props: {
  visible: boolean;
  roomId: number;
  onClose: () => void;
}) => {
  let [pw, setPw] = useState('');
  let ref = useRef<TextInput>(null);

  const apply2ndPassword = async () => {
    if (pw == '') return;
    let hash = hashMD5(pw);
    await AsyncStorage.setItem('2ndPassword-' + props.roomId.toString(), hash);
    props.onClose();
  };

  useEffect(() => {
    if (!props.visible) return;
    setPw('');
    setTimeout(() => { ref.current?.focus(); }, 100);
  }, [props.visible]);

   return (
     <Dialog.Container visible={props.visible}>
       <Dialog.Title>2차 비밀번호 설정</Dialog.Title>
       <Dialog.Description>방을 2차 비밀번호로 암호화하여</Dialog.Description>
       <Dialog.Description>보안을 강화합니다.</Dialog.Description>
       <Dialog.Input textInputRef={ref} value={pw} onChangeText={setPw} />
       <Dialog.Button onPress={props.onClose} label="취소" />
       <Dialog.Button onPress={apply2ndPassword} label="확인" />
     </Dialog.Container>
   );
};

const OpenChatPrompt = (props: {
  visible: boolean;
  roomId: number;
  onClose: () => void;
  onVerify: () => void;
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
    
    props.onVerify();
    props.onClose();
  };

  useEffect(() => {
    if (!props.visible) return;
    setPw('');
    setTimeout(() => { ref.current?.focus(); }, 100);
  }, [props.visible]);

   return (
     <Dialog.Container visible={props.visible}>
       <Dialog.Title>보안방</Dialog.Title>
       <Dialog.Description>2차 비밀번호를 입력해야 볼 수 있습니다.</Dialog.Description>
       <Dialog.Input textInputRef={ref} value={pw} onChangeText={setPw} />
       <Dialog.Button onPress={props.onClose} label="취소" />
       <Dialog.Button onPress={confirm} label="확인" />
     </Dialog.Container>
   );
};

export default function ChatroomList(
  props: MainTabScreenProps<'ChatroomList'>,
) {
  const { socket } = useContext(SocketContext);
  const { navigation } = props;
  const [rooms, setRooms] = useState<ChatroomUnread[] | null>(null);
  const { isLoading, reFetch } = useDoubleFetchAndSave(
    rooms,
    setRooms,
    '/chatroom/myUnreads',
  );
  const [keyExists, setKeyExists] = useState(false);
  const isFocused = useIsFocused();

  // 잠금 prompt
  const [settingPromptVisible, setSettingPromptVisible] = useState(false);
  const [settingPromptRoomId, setSettingPromptRoomId] = useState(-1);
  const [openPromptVisible, setOpenPromptVisible] = useState(false);
  const [openPromptRoomId, setOpenPromptRoomId] = useState(-1);
  // 방 검색
  const [searchText, setSearchText] = useState("");

  // 서버에서 메시지를 보냈을 때, unread count++
  // socket이 바뀌면 event attach함.
  useEffect(() => {
    socket.on('server:notificateMessage', (content: string) => {
      reFetch();
    });
  }, [socket]);

  useEffect(() => {
    reFetch();
  }, [isFocused]);

  useEffect(() => {
    checkPrevKey();
  }, [isFocused]);

  const checkPrevKey = async () => {
    const privKey = await AsyncStorage.getItem('PrivateKey');
    if (privKey !== null) {
      setKeyExists(true);
    }
  }

  const handleAddChatroom = () => {
    navigation.push('AddChatroom');
  };

  const roomsComponent = () => {
    if (isLoading) {
      return <ChatroomLoading />;
    } else if (!keyExists) {
      return (
        <TouchableOpacity style={styles.warning} onPress={checkPrevKey}>
          <Ionicons style={{ marginBottom: 20 }} name="reload" size={30} color="black" />
          <Text style={{ color: 'grey' }}>설정에서 암호키를 생성해주세요.</Text>
        </TouchableOpacity>
      );
    } else if (rooms === null || rooms.length === 0) {
      return (
        <View style={styles.titleMsgContainer}>
          <Text style={styles.titleMsg}>채팅방이 존재하지 않습니다.</Text>
        </View>
      );
    }
    
    let sortedRooms = rooms.slice();
    sortedRooms.sort((a, b) => (new Date(b.lastMessageDate)).getTime() - (new Date(a.lastMessageDate)).getTime());
    return sortedRooms.filter((room) => room.name.includes(searchText)).map(room => {
      return (
        <ChatroomBox
          key={room.chatroomId}
          chatroomId={room.chatroomId}
          name={room.name}
          type={room.type}
          createDate={room.createDate}
          updateDate={room.updateDate}
          msgExpTime={room.msgExpTime}
          unreadCount={room.numUnreadMessages}
          navigation={navigation}
          onPress2ndPwSetting={() => {
            setSettingPromptVisible(true);
            setSettingPromptRoomId(room.chatroomId);
          }}
          onPressLock={() => {
            setOpenPromptVisible(true);
            setOpenPromptRoomId(room.chatroomId);
          }}
          onPressUnlock={() => {
            navigation.push('Chat', { chatroomId: room.chatroomId});
          }}
        />
      );
    });
  };

  return (
    <>
      <Header categoryName="대화방" onPressAddFriend={handleAddChatroom} />
      <PasswordSettingPrompt
        visible={settingPromptVisible}
        roomId={settingPromptRoomId}
        onClose={() => {
          setSettingPromptVisible(false);
        }}
      />
      <OpenChatPrompt
        visible={openPromptVisible}
        roomId={openPromptRoomId}
        onClose={() => {
          setOpenPromptVisible(false);
        }}
        onVerify={() => {
          navigation.push('Chat', { chatroomId: openPromptRoomId});
        }} 
      />
      <View style={styles.container}>
        <Searchbar 
          searchText={searchText} 
          setTextChange={setSearchText}
        />
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {roomsComponent()}
        </ScrollView>
        <View style={{ height: 200 }}></View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scroll: {
    marginBottom: 161,
  },
  title: {
    fontSize: 25,
    fontFamily: 'noto-bold',
    lineHeight: 45,
  },
  logout: {
    marginTop: 20,
  },
  titleMsgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleMsg: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontFamily: 'noto-reg',
    color: '#979797',
    lineHeight: 45,
    marginTop: 50,
  },
  warning: {
    marginTop: 40,
    alignItems: 'center',
  },
});
