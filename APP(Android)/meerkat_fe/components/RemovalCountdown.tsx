import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

type RemovalCountdownProps = {
  countdown: number | null;
  setCountdown: Function;
};

export default function RemovalCountdown(props: RemovalCountdownProps) {
  const { countdown, setCountdown } = props;
  const [cd, setCd] = useState(countdown);
  const isFocused = useIsFocused()
  useEffect(() => {
    console.log('isFocused', isFocused, countdown)
    setCd(countdown);
    const timer = setInterval(() => {
      setCd(prev => {
        console.log('oh', new Date().toString())
        if (prev === null || cd === 0) {
          clearInterval(timer)
          return null;
        }
        return prev - 1000;
      })
    }, 1000)
    // if (!isFocused) return clearInterval(timer)
    return clearInterval(timer)
  }, [countdown]);

  return (
    <View>
      {cd !== null ? (
        <>
          <Text>최상단의 메세지가 </Text>
          <Text>{Math.ceil(cd/1000)}</Text>
          <Text>초 뒤에 삭제됩니다.</Text>
        </>
      ) : (
        <Text>삭제될 메세지가 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
})
