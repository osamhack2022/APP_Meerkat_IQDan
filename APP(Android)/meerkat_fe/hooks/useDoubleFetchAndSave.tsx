import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import api from '../common/api';

/**
 * 신규 서버 데이터가 로컬 데이터에 묻히지 않도록
 * 로컬 데이터 불러온 뒤 신규 서버 데이터로 덮어씌우는 것을 보증하는
 * custom hook. 그리고, 서버에서 불러온 데이터는 해당 asyncKey로 다시 저장하여
 * 덮어씌웁니다.
 * 사용방법: 자신이 받을 state의 초기값을 null로 설정하고 setOriginalState은
 * 그 state의 set함수를 넘겨주면 끝.
 * @param props
 * @type T는 넘겨줄 state의 타입임.
 * @return isLoading 서버나 로컬 둘 중 하나라도 완료되면 true. 둘 다 로딩중이면 false
 */
export default function useDoubleFetchAndSave<T>(
  originalState: T, // 데이터를 저장할 state
  setOriginalState: Function, // 데이터를 저장할 state의 set 함수
  apiUrl: string, // 서버에서 불러올 api url. Async key값도 동일하게 사용함.
  handleResCallback?: Function // api결과를 후처리 해주어야할 때 넣어주는 콜백. api.then 안에 들어갈 res처리용 함수.
) {
  const [localData, setLocalData] = useState<T | null>(null);
  const [serverData, setServerData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFromLocal();
    fetchFromServer();
  }, []);

  useEffect(() => {
    // set loading
    if (serverData !== null || localData !== null) {
      setIsLoading(false);
    }
    // set original state
    if (serverData !== null) {
      setOriginalState(serverData);
    } else {
      setOriginalState(localData);
    }
  }, [localData, serverData]);

  const fetchFromLocal = () => {
    AsyncStorage.getItem(apiUrl)
      .then(res => {
        if (res !== null) {
          setLocalData(JSON.parse(res));
        }
      })
      .catch(err => {
        Alert.alert('로컬에서 데이터를 가져올 수 없었습니다.');
      });
  };

  const fetchFromServer = () => {
    api
      .get(apiUrl)
      .then(res => {
        if (handleResCallback) {
          handleResCallback(res)
        } else {
          setServerData(res.data.data);
          AsyncStorage.setItem(apiUrl, JSON.stringify(res.data.data)).catch(err => {
            Alert.alert('로컬에 데이터를 저장할 수 없었습니다.');
          });
        }
      })
      .catch(err => {
        Alert.alert('서버에서 데이터를 가져올 수 없었습니다.');
      });
  };

  const reFetch = () => {
    fetchFromLocal();
    fetchFromServer();
  }

  return { isLoading, reFetch};
}
