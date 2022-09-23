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

## socket.io 동작 및 설치
client에서 .emit('EVENTNAME')으로 보내면 서버에서 .on('EVENTNAME')으로 받는다.

[공식 문서](https://socket.io/docs/v3/server-initialization/)

아래 명령어로 typescript socketio를 설치 할 수 있다.
```
npm install @types/socket.io
```

## 채팅방 아키텍처

foreground는 socket.io로
https://forceson.github.io/android/%EC%B1%84%ED%8C%85%EC%95%B1%EC%9D%84-%EC%84%A4%EA%B3%84%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B4-%EB%82%B4%EC%9A%A9/

오프라인일 경우에, rabbitMQ같은 message queuing 서비스를 쓰던가, socket이 활성화된 사용자에게만 메시지를 보내고(socket.volatile - socket message queue에 넣던가), db에 저장하던가(redis pub/sub) 그리고 다시 연결되었을 때 찾아서 보내기, 또는 반복 재전송 방식을 택하는 것 같음.

- 배민에서 같은 내용으로 고민한 것. socket이 계속 연결되게 했다.(웹임)
- db에 저장하고, heartbeat로 재전송, 실패한 건 다시 db에.
https://techblog.woowahan.com/2547/

- 위피에서 같은 내용으로 고민한 것. RabbitMQ를 썼다.
https://nrise.github.io/posts/using-rabbitmq/

background는 FCM이나 SSE를 사용하면 될 것 같음. FCM은 외부 접속이니까 SSE가 좋을 듯.(동접 수가 적긴 함)

redis pub/sub 방식 사용해서 분산처리도 할 수 있음.