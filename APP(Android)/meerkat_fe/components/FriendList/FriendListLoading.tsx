// core
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  SafeAreaView,
  Text,
  Button,
} from 'react-native';
// comp
import MyBoxLoading from '../../components/FriendList/MyBoxLoading';
import CategoryBoxLoading from '../../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../../components/FriendList/FriendBoxLoading';
import EventFriendBoxLoading from '../../components/FriendList/EventFriendBoxLoading';
import Header from '../../components/FriendList/Header';

export default function FriendListLoading() {
  const glitterAnim = useRef(new Animated.Value(0.4)).current;

  const generateJSX = (n: number, jsx: React.ReactElement) => {
    return Array.from({ length: 5 }, (_, index) => {
      return React.cloneElement(jsx, { key: index });
    });
  };

  return (
    <View style={styles.mainContainer}>
      <Header categoryName="전우 목록" />
      <View>
        <MyBoxLoading animatedValue={glitterAnim} />
        <CategoryBoxLoading animatedValue={glitterAnim} />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.eventContainer}
          >
            {generateJSX(
              10,
              <EventFriendBoxLoading animatedValue={glitterAnim} />,
            )}
          </ScrollView>

          <CategoryBoxLoading animatedValue={glitterAnim} />
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.eventContainer}
          >
            {generateJSX(
              10,
              <EventFriendBoxLoading animatedValue={glitterAnim} />,
            )}
          </ScrollView>

          <CategoryBoxLoading animatedValue={glitterAnim} />
          {generateJSX(
            10,
            <FriendBoxLoading animatedValue={glitterAnim} />,
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  eventContainer: {
    marginLeft: 17,
    height: 75,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 19,
    marginLeft: 18,
    marginRight: 12,

    backgroundColor: '#DBDBDB',
  },
});
