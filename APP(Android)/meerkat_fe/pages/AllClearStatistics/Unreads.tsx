import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, ScrollView } from 'react-native';
import { AllClear, FetchState, User } from '../../common/types';
import CategoryBoxLoading from '../../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../../components/FriendList/FriendBoxLoading';
import { generateJSX } from '../../common/generateJSX';
import CategoryBox from '../../components/FriendList/CategoryBox';
import AllClearBox from '../../components/AllClear/AllClearBox';
import FriendBox from '../../components/FriendList/FriendBox';

export default function AllClears(props: FetchState) {
  // params
  const { list, isLoading, isFault, isError, categoryName } = props;

  const readData = () => {
    if (isFault) {
      return (
        <View style={styles.empty}>
          <Text>잘못된 요청입니다.</Text>
        </View>
      );
    }
    if (isLoading) {
      // loading
      const glitterAnim = useRef(new Animated.Value(0.4)).current;
      return (
        <>
          <CategoryBoxLoading animatedValue={glitterAnim} />
          {generateJSX(15, <FriendBoxLoading animatedValue={glitterAnim} />)}
        </>
      );
    }
    if (isError) {
      return (
        <View style={styles.empty}>
          <Text>네트워크 오류입니다.</Text>
        </View>
      );
    }
    if (list.length === 0) {
      return (
        <>
          <CategoryBox categoryName={categoryName} />
          <View style={styles.empty}>
            <Text>응답이 없습니다.</Text>
          </View>
        </>
      );
    }

    return (
      <>
        <CategoryBox categoryName={categoryName} />
        <ScrollView>
          {list.map((user: User) => {
            return (
              <FriendBox
                key={user.userId}
                name={user.name}
                image={user.image}
              />
            );
          })}
        </ScrollView>
      </>
    );
  };

  return <>{readData()}</>;
}

const styles = StyleSheet.create({
  empty: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
