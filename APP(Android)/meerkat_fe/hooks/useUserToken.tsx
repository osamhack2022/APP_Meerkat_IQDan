import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback, useContext } from "react";
import { LoginContext } from "../common/Context";
import { isEmpty, isEmptyString } from "../common/isEmpty";

export default function useUserToken() {
  const [userToken, setUserToken] = useState<string | null>(null); // null implies loading
  const [userId, setUserId] = useState<number | null>(null); // null implies loading
  const { refreshLoginToken } = useContext(LoginContext);

  const getCurrentToken = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const expDate = await AsyncStorage.getItem("userTokenExpiration");
    // if not valid, then refresh
    if(isEmpty(token) || isEmptyString(token!) || isEmpty(expDate) || Date.now() >= Number(expDate)){
      // TODO : 이러면 로그아웃임.
      refreshLoginToken();
    }

    setUserToken(token);
    // TODO : encoded 값 확인하고 setUserId에 넣기
    const encoded: string = Buffer.from(token!, "utf8").toString("base64");
    // setUserId(encoded);
    console.log(encoded);
  };

  return { userToken, userId, getCurrentToken };
  // getCurrentToken() 호출하면 만료되거나 없는 토큰 -> 로그아웃 처리(or refresh) - 로그아웃 처리는 세호형한테 맡겨야 할듯.
  // 토큰 존재 시 -> userToken, userId가 갱신됨.
}

// 1. async에서 토큰 가져오는 것을 hook으로 + loading state 넣어주기 -> 중복 많이 되는데...
// 2. 그냥 asynce get 해버리면 토큰 쓰는 모든 페이지에서 useState 써야하니까 그걸 여기서 처리해주는 느낌.
// 3. 만료되면 refresh하는 부분은 usecontext로 원래 있는 코드 호출(uselogincheck 부르면 됨)

// TODO. Q1. loginContext에 token을 넣으면 안되나? 그러면 그 token을 전역에서 쓸 수 있을 텐데.
// Q2. useLoginCheck의 loginToken을 쓰면 안되는 이유를 정말 모르겠음.
// get부분은 코드도 중복되고, 쓸 때도 hook 쓰는 부분 동일할 것 같은데.

// auth context에 token 넣어서 쓰는 경우 
// https://velog.io/@mementomori/Auth%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-%EA%B5%AC%ED%98%84-React-Native