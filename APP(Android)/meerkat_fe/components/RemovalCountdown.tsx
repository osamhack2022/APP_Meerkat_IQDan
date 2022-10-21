import { useEffect, useState} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { ChatroomWithKey } from '../common/types';

type RemovalCountdownProps = {
  countdown: number | null;
  setCountdown: Function;
  showCd: boolean;
  setShowCd: Function;
  chatroomInfo: ChatroomWithKey | null;
};

export default function RemovalCountdown(props: RemovalCountdownProps) {
  const { countdown, setCountdown, showCd, chatroomInfo, setShowCd } = props;
  const [cd, setCd] = useState(0);
  const isFocused = useIsFocused()

  useEffect(() => {
    if(chatroomInfo === null) return;
    if (chatroomInfo.removeType === "FROMEARTH") setShowCd(true)

  }, [chatroomInfo])


  useEffect(() => {
    if (cd < 0) return;
    const timer = setTimeout(() =>{
      setCd(prev => prev-1000)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [cd])

  useEffect(() => {
    if(countdown === null) return;
    setCd(countdown)
  }, [countdown]);

  if (!showCd) return <></>
  return (
    <View style={styles.container}>
      {cd > 0 ? (
        <>
          <Text style={styles.text}>최상단의 메세지가 </Text>
          <Text style={styles.text}>{Math.ceil(cd/1000)}</Text>
          <Text style={styles.text}>초 뒤에 삭제됩니다.</Text>
        </>
      ) : (
        <Text style={styles.text}>삭제될 메세지가 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#6A4035',
    color: 'white',
    padding: 5
  },
  text :{
    color: 'white'
  }
})
