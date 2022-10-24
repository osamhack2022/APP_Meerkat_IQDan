// core
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// type
import { Category } from '../common/types.d';

interface HeaderProps extends Category {
  onPressBack: () => void;
}

export default function AngleBracketHeader(props: HeaderProps) {
  const { categoryName, onPressBack } = props;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.backButtonContainer}>
        <Ionicons
          onPress={onPressBack}
          name="chevron-back"
          size={24}
          color="#6A4035"
        />
      </View>
      <View>
        <Text style={styles.headerText}>{categoryName}</Text>
      </View>
      <View style={styles.rightButtonContainer}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderBottomColor: '#6A4035',
  },
  backButtonContainer: {
    marginLeft: 20,
  },
  headerText: {
    fontSize: 18,
    color: '#6A4035',
    fontFamily: 'noto-med',
    lineHeight: 48,
  },
  rightButtonContainer: {
    marginRight: 20,
    width: 24,
    height: 24,
  },
});
