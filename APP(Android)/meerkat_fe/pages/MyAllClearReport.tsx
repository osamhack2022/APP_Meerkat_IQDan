import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { isEmpty } from '../common/isEmpty';
import {
  AllClear,
  AllClearResponseType,
  RootStackParamList,
} from '../common/types.d';
import CategoryBoxLoading from '../components/FriendList/CategoryBoxLoading';
import FriendBoxLoading from '../components/FriendList/FriendBoxLoading';
import { generateJSX } from '../common/generateJSX';
import api from '../common/api';
import CategoryBox from '../components/FriendList/CategoryBox';
import AngleBracketHeader from '../components/AngleBracketHeader';

type MyAllClearReportProps = StackScreenProps<
  RootStackParamList,
  'MyAllClearReport'
>;

// 나의 보고
const categoryName = '나의 보고';

export default function MyAllClearReport(props: MyAllClearReportProps) {
  // params
  const { navigation } = props;
  const { messageId, chatroomId } = props.route.params;

  // data
  const [myAllClearReport, setMyAllClearReport] = useState<AllClear | null>(
    null,
  );
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
      <View style={styles.empty}>
        <View style={styles.container}>
          <View style={styles.selectBoxContainer}>
            <View
              style={[
                styles.selectBox,
                myAllClearReport.type === AllClearResponseType.CLEAR
                  ? styles.selectedBackgroundColor
                  : styles.unselectedBackgroundColor,
              ]}
            >
              <Text
                style={[
                  { fontSize: 16 },
                  myAllClearReport.type === AllClearResponseType.CLEAR
                    ? styles.selectedTextColor
                    : styles.unselectedTextColor,
                ]}
              >
                이상 무
              </Text>
            </View>
            <View
              style={[
                styles.selectBox,
                myAllClearReport.type === AllClearResponseType.PROBLEM
                  ? styles.selectedBackgroundColor
                  : styles.unselectedBackgroundColor,
              ]}
            >
              <Text
                style={[
                  { fontSize: 16 },
                  myAllClearReport.type === AllClearResponseType.PROBLEM
                    ? styles.selectedTextColor
                    : styles.unselectedTextColor,
                ]}
              >
                특이사항
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.textInputContainer}>
              <CategoryBoxLoading animatedValue={glitterAnim} />
            </View>
          ) : (
            <View style={styles.textInputContainer}>
              <Text style={styles.textInput}>{myAllClearReport.content}</Text>
            </View>
          )}

          <Pressable
            style={styles.submitButton}
            onPress={() => {
              navigation.navigate('Chat', { chatroomId: chatroomId });
            }}
          >
            <Text style={styles.submitButtonText}>확인</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <>
      <AngleBracketHeader
        categoryName={'나의 보고'}
        onPressBack={() =>
          navigation.navigate('Chat', { chatroomId: chatroomId })
        }
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
  container: {
    height: '50%',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  selectBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectBox: {
    height: 46,
    width: '49.5%',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBackgroundColor: {
    backgroundColor: '#6A4035',
  },
  selectedTextColor: {
    color: '#FFFFFF',
  },
  unselectedBackgroundColor: {
    backgroundColor: '#E5B47F',
  },
  unselectedTextColor: {
    color: '#6A4035',
  },
  textInputContainer: {
    backgroundColor: '#FFF9D2',
    height: '80%',
    borderColor: '#6A4035',
    flexShrink: 1,
    marginTop: 17,
    marginBottom: 17,
    borderWidth: 2,
    borderRadius: 10,
  },
  textInput: {
    margin: 10,
    fontSize: 16,
    color: '#6A4035',
  },
  submitButton: {
    height: 59,
    width: '100%',
    backgroundColor: '#6A4035',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
