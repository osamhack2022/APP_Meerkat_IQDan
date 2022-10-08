import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../env.json';

/**
 * 사용법:
 * axios와 동일함.
 * api.get('/home').then((r) => {}).catch((e) => {})
 * 
 * api는 자동으로 auth check은 못해주는 상태임. 
 * 즉, useAuthRoute을 한번 불러주어야 로그아웃되었으면 로그인 창으로 가짐.
 */

const api = axios.create({
  baseURL: env.dev.apiBaseUrl
})

api.interceptors.request.use(
  async (config: AxiosRequestConfig<any>) => {
    const token = await AsyncStorage.getItem('userToken')

    if (config.headers === undefined) {
        config.headers = {}
        console.log("HEADER EMPTY!!!")
    } else {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    /*
        http status가 200인 경우
        응답 성공 직전 호출됩니다.
        .then() 으로 이어집니다.
    */

    return response;
  },

  (error) => {
    /*
        http status가 200이 아닌 경우
        응답 에러 직전 호출됩니다.
        .catch() 으로 이어집니다.
    */
    return Promise.reject(error);
  }
);

export default api;