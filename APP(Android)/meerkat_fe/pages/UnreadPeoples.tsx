// core
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StyleSheet, Text, View } from 'react-native';
// type
import { RootStackParamList, User } from '../common/types';
// routing
import { StackScreenProps } from '@react-navigation/stack';
import { isEmpty } from '../common/isEmpty';
import api from '../common/api';
// components
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
import CategoryBox from '../components/FriendList/CategoryBox';
import FriendBox from '../components/FriendList/FriendBox';
import CategoryBoxLoading from '../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../components/FriendList/FriendBoxLoading';
import { ScrollView } from 'react-native-gesture-handler';
import { getImage } from '../common/getImage';

type UnreadsPeopleProps = StackScreenProps<RootStackParamList, 'UnreadPeoples'>;

export default function UnreadPeoples(props: UnreadsPeopleProps) {
  // params
  const { navigation } = props;
  const { chatroomId, messageId } = props.route.params;

  // data
  const [unreads, setUnreads] = useState<User[]>([]);
  const [reads, setReads] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false); // error occur then true

  // loading
  const glitterAnim = useRef(new Animated.Value(0.4)).current;
  const generateJSX = (n: number, jsx: React.ReactElement) => {
    return Array.from({ length: n }, (_, index) => {
      return React.cloneElement(jsx, { key: index });
    });
  };

  // hardware back press action
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Chat', { chatroomId: chatroomId });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(()=>{
    const getData = async () => {
        try{
            const unreadsResponse = await api.post("/messages/unread", {
                chatroomId: chatroomId,
                messageId: messageId
            });
            const readsResponse = await api.post("/messages/read", {
                chatroomId: chatroomId,
                messageId: messageId
            });
            setUnreads(unreadsResponse.data.data);
            setReads(readsResponse.data.data);
        }
        catch{
            setError(true);
        }
        finally{
            setIsLoading(false);
        }
    };
    getData();
  }, []);

  const readList = () => {
    if (isEmpty(chatroomId) || isEmpty(messageId)) { // parameter not exists
      return (
        <View style={styles.empty}>
          <Text>잘못된 요청입니다.</Text>
        </View>
      );
    }
    if (isLoading) { // while loading
      return (
        <>
          <CategoryBoxLoading animatedValue={glitterAnim} />
          {generateJSX(15, <FriendBoxLoading animatedValue={glitterAnim} />)}
        </>
      );
    }
    if (error) { // error while fetching data
      return (
        <View style={styles.empty}>
          <Text>네트워크 오류입니다.</Text>
        </View>
      );
    }

    return (
        <ScrollView>
          <CategoryBox categoryName={'읽지 않은 전우들'} />
          {unreads.map((user: User) => {
            return <FriendBox key={user.userId} name={user.name} image={user.image}/>;
          })}
          <CategoryBox categoryName={'읽은 전우들'} />
          {reads.map((user: User) => {
            return <FriendBox key={user.userId} name={user.name} image={user.image}/>;
          })}
        </ScrollView>
    );
  };

return (
  <>
    <ChatroomHeader
      onPressBack={() =>
        navigation.navigate('Chat', { chatroomId: chatroomId })
      }
      name={''}
    />
    {readList()}
  </>
);
}

const styles = StyleSheet.create({
  empty: {
    position:"absolute",
    //backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
