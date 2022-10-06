import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback, useContext } from "react";
import { LoginContext } from "../common/Context";
import { isEmpty, isEmptyString } from "../common/isEmpty";

export default function useUserToken() {
  const [userToken, setUserToken] = useState<string | null>(null); // null implies loading
  const [userId, setUserId] = useState<number | null>(null); // null implies loading
  const [isUserTokenLoading, setUserTokenLoading] = useState(true);
  const { refreshLoginToken } = useContext(LoginContext);

  useEffect(() => {
    isEmpty(userToken) ? decodeAndSetUserId() : setUserId(null);
    isEmpty(userToken) ? setUserTokenLoading(true) : setUserTokenLoading(false);
  }, [userToken])

  const refreshUserToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const expDate = await AsyncStorage.getItem("userTokenExpiration");
    // if not exists or expired, then logout
    if(isEmpty(token) || isEmptyString(token!) || isEmpty(expDate) || Date.now() >= Number(expDate)){
      // TODO : 이러면 로그아웃임.
      setUserToken(null);
      refreshLoginToken();
    }

    setUserToken(token);
  };

  const decodeAndSetUserId = async() =>{
    if(isEmpty(userToken) || isEmptyString(userToken!)) return null;
    const decoded: string = Buffer.from(userToken!, "utf8").toString("base64");
    // TODO : decoded 값 확인하기
    console.log(decoded);
    setUserId(Number(decoded));
  }

  return { userToken, userId, isUserTokenLoading, refreshUserToken };
  // refreshUserToken() 호출 시
  // 없거나 만료됨 -> 로그아웃 처리
  // 토큰 존재 시 -> userToken, userId가 갱신됨.
}

// 1. async에서 토큰 가져오는 것을 hook으로 + loading state 넣어주기 -> 중복 많이 되는데...
// 2. 그냥 asynce get 해버리면 토큰 쓰는 모든 페이지에서 useState 써야하니까 그걸 여기서 처리해주는 느낌.
// 3. 만료되면 refresh하는 부분은 usecontext로 원래 있는 코드 호출(uselogincheck 부르면 됨)
