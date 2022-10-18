import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { getImage } from '../../common/getImage';
import { AnimatedValue } from '../../common/types';
import getGlitterStyle from '../FriendList/getGlitterStyle';
import { Ionicons } from '@expo/vector-icons';

export default function AddChatroomFriendBoxLoading(props: AnimatedValue) {
  // glittering animation while loading
  const { animatedValue } = props;
  const glitterStyle = getGlitterStyle(animatedValue);

  return (
    <View style={styles.container}>
      <View style={styles.friendSelectLoading}>
        <Image source={getImage(null)} style={styles.profileImageLoading} />
        <Text style={styles.friendTextLoading}>
          <Animated.View style={glitterStyle} />
        </Text>
        <Ionicons style={styles.radioLoading} name="radio-button-off" size={24} color="#6A4035" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  friendSelectLoading: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  friendTextLoading: {
    height: 25,
    width: 120,
    backgroundColor: '#DBDBDB',
  },
  radioLoading: {
    marginTop: 10,
    marginRight: 10,
  },
  profileImageLoading: {
    width: 46,
    height: 46,
    borderRadius: 17,
  },
});
