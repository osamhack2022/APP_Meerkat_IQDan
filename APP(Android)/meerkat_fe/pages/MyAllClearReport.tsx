import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, View, Text, StyleSheet } from 'react-native';
import { isEmpty } from '../common/isEmpty';
import { AllClear, RootStackParamList } from '../common/types';
import ChatroomHeader from '../components/Chatroom/ChatroomHeader';
import CategoryBoxLoading from '../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../components/FriendList/FriendBoxLoading';
import { generateJSX } from '../common/generateJSX';
import api from '../common/api';
import CategoryBox from '../components/FriendList/CategoryBox';

type MyAllClearReportProps = StackScreenProps<
  RootStackParamList,
  'MyAllClearReport'
>;

// 나의 보고
const categoryName = "나의 보고";

export default function MyAllClearReport(props: MyAllClearReportProps) {
  // params
  const { navigation } = props;
  const { messageId, chatroomId } = props.route.params;
  
  // data
  const [myAllClearReport, setMyAllClearReport] = useState<AllClear | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false); // error occur then true

  const glitterAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await api.get(`/allclear/response/${messageId}`);
        setMyAllClearReport(result.data.data);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

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

  const readData = () => {
    if (isEmpty(chatroomId) || isEmpty(messageId)) {
      // parameter not exists
      return (
        <View style={styles.empty}>
          <Text>잘못된 요청입니다.</Text>
        </View>
      );
    }
    if (isLoading) {
      // loading
      return (
        <>
          <CategoryBoxLoading animatedValue={glitterAnim} />
          {generateJSX(15, <FriendBoxLoading animatedValue={glitterAnim} />)}
        </>
      );
    }
    if (error) {
      // error while fetching data
      return (
        <View style={styles.empty}>
          <Text>네트워크 오류입니다.</Text>
        </View>
      );
    }
    if (myAllClearReport === null) {
      return (
        <>
          <CategoryBox categoryName={categoryName} />
          <View style={styles.empty}>
            <Text>제출한 보고가 없습니다.</Text>
          </View>
        </>
      );
    }

    return (
      <>
        <CategoryBox categoryName={categoryName} />
        <Text>{myAllClearReport.type}</Text>
        <Text>{myAllClearReport.content}</Text>
      </>
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
      {readData()}
    </>
  );
}

const styles = StyleSheet.create({
  empty: {
    position: 'absolute',
    //backgroundColor: 'white',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
