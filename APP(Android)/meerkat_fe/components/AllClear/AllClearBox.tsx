import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AllClear } from '../../common/types';
import FriendBox from '../FriendList/FriendBox';

export default function AllClearBox(props: AllClear) {
  const user = props.user;
  return (
    <>
      <FriendBox key={user.userId} name={user.name} image={user.image} />
      <View style={styles.textBox}>
        <Text style={styles.text}>{props.content}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textBox: {
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 10
  },
  text:{
    fontSize: 18
  }
});
