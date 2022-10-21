import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  View,
  Alert,
  StyleSheet,
  Pressable,
  TextInput,
  Text,
} from 'react-native';
import { AllClear, AllClearResponseType, RootStackParamList } from '../common/types.d';
import api from '../common/api';
import AngleBracketHeader from '../components/AngleBracketHeader';
import { isEmpty } from '../common/isEmpty';

type ReportAllClearProps = StackScreenProps<
  RootStackParamList,
  'ReportAllClear'
>;

// 이상무 보고
export default function ReportAllClear(props: ReportAllClearProps) {
  // params
  const { navigation } = props;
  const { messageId, chatroomId } = props.route.params;

  // state
  const [isSubmitActive, setIsSubmitActive] = useState(true);

  // data
  const [allClearType, setAllClearType] = useState(AllClearResponseType.CLEAR);
  const [problemContent, setProblemContent] = useState('');
  const [allClearContent, setAllClearContent] = useState('');
  const [closeFlag, setCloseFlag] = useState(true);

    // fetch
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false); // error occur then true
    const [alreadyExists, setAlreadyExists] = useState(false); // already submit on past

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await api.get(`/allclear/response/${messageId}`);
        const myAllClearReport: AllClear = result.data.data;
        if(!isEmpty(myAllClearReport)){
          setAlreadyExists(true);
          setAllClearType(myAllClearReport.type);
          getSetCurrentContent(myAllClearReport.type)(myAllClearReport.content);
        }
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

  const handleClose = (closeFlag: boolean) => {
    setCloseFlag(!closeFlag);
  };

  const enableSubmit = () => {
    setIsSubmitActive(true);
  };

  const disableSubmit = () => {
    setIsSubmitActive(false);
  };

  const handleTypeChange = (type: AllClearResponseType) => {
    setAllClearType(type);
  };

  // 제출
  const submitAllClear = () => {
    disableSubmit();
    if (getCurrentContent(allClearType) === '') {
      enableSubmit();
      return Alert.alert('내용을 입력해 주세요.');
    }

    api
      .put(`/allclear/response/create`, {
        messageId: messageId,
        allClearResponseType: allClearType,
        content: getCurrentContent(allClearType),
      })
      .then(() => {
        Alert.alert('보고가 완료되었습니다.');
        navigation.navigate('Chat', { chatroomId: chatroomId });
      })
      .catch(e => {
        console.log(e.response);
        enableSubmit();
        return Alert.alert('서버와의 통신이 원활하지 않습니다.');
      });
  };

  const getCurrentContent = (allClearType: AllClearResponseType): string=>{
    if(allClearType === AllClearResponseType.CLEAR){
      return allClearContent;
    }
    if(allClearType === AllClearResponseType.PROBLEM){
      return problemContent;
    }
    else return "";
  }

  const getSetCurrentContent = (allClearType: AllClearResponseType) =>{
    if(allClearType === AllClearResponseType.CLEAR){
      return setAllClearContent;
    }
    if(allClearType === AllClearResponseType.PROBLEM){
      return setProblemContent;
    }
    return ()=>{};
  }

  return (
    <>
      <AngleBracketHeader
        categoryName={'보고하기'}
        onPressBack={() =>
          navigation.navigate('Chat', { chatroomId: chatroomId })
        }
      />

      <View style={styles.empty}>
        <View style={styles.container}>
          <Pressable onPress={() => handleClose(closeFlag)}>
            <View style={styles.selectBoxContainer}>
              <Pressable
                style={[
                  styles.selectBox,
                  allClearType === AllClearResponseType.CLEAR
                    ? styles.selectedBackgroundColor
                    : styles.unselectedBackgroundColor,
                ]}
                onPress={() => handleTypeChange(AllClearResponseType.CLEAR)}
              >
                <Text
                  style={[
                    { fontSize: 16 },
                    allClearType === AllClearResponseType.CLEAR
                      ? styles.selectedTextColor
                      : styles.unselectedTextColor,
                  ]}
                >
                  이상 무
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.selectBox,
                  allClearType === AllClearResponseType.PROBLEM
                    ? styles.selectedBackgroundColor
                    : styles.unselectedBackgroundColor,
                ]}
                onPress={() => handleTypeChange(AllClearResponseType.PROBLEM)}
              >
                <Text
                  style={[
                    { fontSize: 16 },
                    allClearType === AllClearResponseType.PROBLEM
                      ? styles.selectedTextColor
                      : styles.unselectedTextColor,
                  ]}
                >
                  특이사항
                </Text>
              </Pressable>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={getSetCurrentContent(allClearType)}
                value={getCurrentContent(allClearType)}
                placeholder="특이사항 입력 (200자)"
                multiline={true}
              />
              <View style={styles.textCountContainer}>
                <Text style={styles.textCount}>{getCurrentContent(allClearType).length}/200</Text>
              </View>
              
            </View>
            <Pressable style={styles.submitButton} onPress={submitAllClear}>
              <Text style={styles.submitButtonText}>{alreadyExists ? "수정하기" : "제출하기"}</Text>
            </Pressable>
          </Pressable>
        </View>
      </View>
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
    justifyContent:"space-around"
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
  textInputContainer:{
    backgroundColor: '#FFF9D2',
    height:"80%",
    borderColor: '#6A4035',
    flexShrink: 1,
    marginTop: 17,
    marginBottom: 17,
    borderWidth: 2,
    borderRadius: 10,
    flexDirection:"column",
    justifyContent:"space-between"
  },
  textInput: {
    margin: 10,
    fontSize:20,
    color:"#6A4035",
    lineHeight: 30
  },
  textCountContainer:{
    flexDirection:"row-reverse",
    margin:10,
  },
  textCount:{
    fontSize:16,
    color:"#6A4035"
  },
  submitButton:{
    height:59,
    width:"100%",
    backgroundColor:"#6A4035",
    borderRadius:11,
    alignItems:"center",
    justifyContent:"center"
  },
  submitButtonText:{
    color:"white",
    fontSize:16
  }
});