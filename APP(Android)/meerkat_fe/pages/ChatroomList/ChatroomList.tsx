// core
import { useEffect, useState, useContext, useRef } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button
} from 'react-native';
// comps
import Searchbar from '../../components/ChatroomList/Searchbar';
import ChatroomBox from '../../components/ChatroomList/ChatroomBox';
import ChatroomLoading from '../../components/ChatroomList/ChatroomLoading';
import useDoubleFetchAndSave from '../../hooks/useDoubleFetchAndSave';
// types
import { ChatroomUnread, MainTabScreenProps } from '../../common/types';
import ChatroomListHeader from '../../components/ChatroomList/ChatroomListHeader';
import { SocketContext } from '../../common/Context';
// thirds
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { hashMD5 } from '../../common/crypto';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connectBelongRooms } from '../../common/globalSocket';
import { PasswordSettingPrompt, OpenChatPrompt } from '../../components/ChatroomList/Prompts';

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
    connectBelongRooms(socket)
    socket.on('server:notificateMessage', (content: string) => {
      reFetch()
    })
  }, [socket])

  // 화면 focus 시 refresh + 현재 rsa key 존재 유무확인.
  useEffect(() => {
    if(isFocused){
      checkPrevKey()
      refresh()
    }
    
  }, [isFocused])

  const refresh = () => {
    connectBelongRooms(socket)
    reFetch()
  }

  // rsa 보안키 존재 유무 확인
  const checkPrevKey = async () => {
    const privKey = await AsyncStorage.getItem('PrivateKey');
    if (privKey !== null) {
      setKeyExists(true)
    }
  }

  const handleAddChatroom = () => {
    navigation.push('AddChatroom')
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
      <ChatroomListHeader categoryName="대화방" onPressAdd={handleAddChatroom} refresh={refresh} />
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
    marginTop:5,
    marginBottom: 97,
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
