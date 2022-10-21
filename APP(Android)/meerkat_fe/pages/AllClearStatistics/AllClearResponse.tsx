import React, { useRef } from 'react';
import { Animated, View, Text, StyleSheet, ScrollView } from 'react-native';
import { AllClear, FetchState } from '../../common/types';
import CategoryBoxLoading from '../../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../../components/FriendList/FriendBoxLoading';
import { generateJSX } from '../../common/generateJSX';
import CategoryBox from '../../components/FriendList/CategoryBox';
import AllClearBox from '../../components/AllClear/AllClearBox';

export default function AllClearResponse(props: FetchState) {
  // params
  const { list, isLoading, isFault, isError, categoryName } = props;
  
  // loading
  const glitterAnim = useRef(new Animated.Value(0.4)).current;

  const readData = () => {
    if (isFault) {
      return (
        <View style={styles.empty}>
          <Text>잘못된 요청입니다.</Text>
        </View>
      );
    }
    if (isLoading) {
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
          {list.map((elem: AllClear) => {
            return (
              <AllClearBox
                key={elem.allClearId}
                allClearId={elem.allClearId}
                type={elem.type}
                content={elem.content}
                user={elem.user}
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
