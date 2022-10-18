import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AllClear } from '../../common/types';
import FriendBox from '../FriendList/FriendBox';

export default function AllClearBox(props: AllClear) {
  const user = props.user;
  return (
    <>
      <FriendBox key={user.userId} name={user.name} image={user.image} />
      <View style={styles.textBox}>{props.content}</View>
    </>
  );
}

const styles = StyleSheet.create({
  textBox: {
    marginLeft: 18,
  },
});
