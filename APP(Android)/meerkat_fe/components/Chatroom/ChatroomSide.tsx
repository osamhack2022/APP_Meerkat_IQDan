import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Animated,
  ProgressViewIOSComponent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatroomWithKey, User } from '../../common/types';
import DrawerUser from './DrawerComp/DrawerUser';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const DURATION = 300;

interface ChatroomSideProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  usersInfo: User[];
  chatroomInfo: ChatroomWithKey | null;
}

const ChatroomSide = (props: ChatroomSideProps) => {
  const opacityAnimValue = useRef(new Animated.Value(0)).current;
  const posAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.isOpen) {
      Animated.timing(opacityAnimValue, {
        useNativeDriver: true,
        toValue: 0.5,
        duration: DURATION,
      }).start();
      Animated.timing(posAnimValue, {
        useNativeDriver: false,
        toValue: 1,
        duration: DURATION,
      }).start();
    }
  }, [props.isOpen]);

  const close = () => {
    Animated.timing(opacityAnimValue, {
      useNativeDriver: true,
      toValue: 0,
      duration: DURATION,
    }).start();
    Animated.timing(posAnimValue, {
      useNativeDriver: false,
      toValue: 0,
      duration: DURATION,
    }).start(() => {
      props.setIsOpen(false);
    });
  };

  const generateText = () => {
    if (props.chatroomInfo === null) return 'chatroomInfo not loaded';
    let res = '';
    // 읽기 옵션
    if (props.chatroomInfo.removeAfterRead) {
      res += '모두가 읽은 후 ';
    } else {
      res += '무조건 ';
    }
    // 초 옵션
    const exp = props.chatroomInfo.msgExpTime;
    if (exp === 10) {
      res += '10초 뒤 삭제';
    } else if (exp === 3600) {
      res += '한 시간 뒤 삭제';
    } else if (exp === 3600 * 24) {
      res += '하루 뒤 삭제';
    } else if (exp === 3600 * 24 * 30) {
      res += '한 달 뒤 삭제';
    } else {
      res += exp.toString() + '초 뒤 삭제';
    }

    return res;
  };

  if (!props.isOpen) return null;

  if (props.chatroomInfo === null) return <></>;
  return (
    <View style={styles.drawer}>
      <AnimatedPressable
        onPress={close}
        style={[styles.outside, { opacity: opacityAnimValue }]}
      ></AnimatedPressable>
      <AnimatedSafeAreaView
        style={[
          styles.inside,
          {
            right: posAnimValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['-65%', '0%'],
            }),
          },
        ]}
      >
        <View>
          <Text style={styles.title}>채팅방 설정</Text>
          <Text style={{ marginLeft: 20, fontFamily: 'noto-bold' }}>
            대화방:{' '}
            <Text style={{ fontFamily: 'noto-med' }}>
              {props.chatroomInfo.name}
            </Text>
          </Text>
          <Text style={{ marginLeft: 20, fontFamily: 'noto-bold' }}>
            삭제:{' '}
            <Text style={{ fontFamily: 'noto-med' }}>{generateText()}</Text>
          </Text>
        </View>
        <View>
          <Text style={styles.title}>대화상대</Text>
        </View>
        <ScrollView>
          {props.usersInfo.map(userInfo => {
            return (
              <DrawerUser
                key={userInfo.userId}
                name={userInfo.militaryRank + ' ' + userInfo.name}
                affiliation={userInfo.affiliatedUnit}
                img={userInfo.image}
              />
            );
          })}
        </ScrollView>
      </AnimatedSafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 10,
    fontFamily: 'noto-bold',
    fontSize: 13,
    lineHeight: 15,
    marginBottom: 0,
    marginTop: 20,
    marginRight: 20,
    color: "#FFF9D2",
    backgroundColor: "#6A4035",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    height: 35,
    borderRadius: 20,
  },
  outside: {
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  inside: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '65%',
    height: '100%',
    top: 0,
    bottom: 0,
  },
  drawer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
});

export default ChatroomSide;
