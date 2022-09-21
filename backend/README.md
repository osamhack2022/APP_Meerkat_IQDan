# Meerkat backend
## 환경 구성
다음과 같은 방식으로 nvm을 설치하고 node 16.3을 설치한다.

[링크]https://hyelie.tistory.com/entry/Install-NVM-typescript-express-starter-on-Ubuntu

그러면 아래와 같은 버전들이 설치되어 있을 것이다.
- nvm 0.39.1
- npm 7.15.1
- node v16.3.0

/backend 폴더에서는 아래 명령어로 실행시킬 수 있다.
```
npm run start
```

## 로그인 동작
login 시 cookie에 authorization token이 저장되며 

이 토큰 값을 가진 상태로 서버에 request를 보내거나, 또는

이 토큰 값을 Authorization header에 'Bearer [TOKEN]' 형식으로 보내면 응답된다.

## socket.io 동작
client에서 .emit('EVENTNAME')으로 보내면 서버에서 .on('EVENTNAME')으로 받는다.

