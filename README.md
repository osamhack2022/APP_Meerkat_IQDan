# APP_Meerkat_IQDan

![Logo](https://i.imgur.com/xyHPVIx.png)

미어캣 - 안전한 군용 채팅앱 (E2EE/WEB3)

## 프로젝트 소개
수많은 장병들이 편의를 위해 카카오톡과 같은 서드파티 메신저앱들을 암암리에 사용하고 있습니다. 훈련 중에는 사용하지 않아도, 훈련 이후 사후 평가나 평시 명령 하달 및 보고 시 자주 사용되고 있습니다. 이런 앱들의 문제점은 군 내부의 정보들이 이러한 민간 서버들에 암호화조차 되지 않고 남을 때가 많다는 것입니다. 

미어캣은 현재 장병들이 사용중인 채팅앱들의 대안을 마련합니다. 

## 기능 설명
 - 주요 채팅 기능 - 비밀 채팅 / 기밀 채팅: 카카오톡 비밀 채팅과 텔레그램은 E2EE(종단간 암호화)를 통해 서버에 남기는 기록들을 암호화합니다. 미어캣은 해당 설계를 벤치마킹하여 기본 채팅을 구동합니다. 하지만 여기서 그치지 않고 WebRTC를 사용하여 서버를 아예 거치지 않고 기기 끼리만 통신하는 P2P E2EE를 구현하여 기존에 없던 새로운 안전한 채팅 통신을 사용할 수 있는 기밀 채팅 기능을 추가하였습니다. 해당 채팅의 기록은 기기에만 남으며, 유통기한이 지나면 빠르게 삭제되도록 설계되었습니다. WebRTC은 원래 비디오와 음성 채팅을 위한 기준으로 만들어진 것이지만, 저희는 안전을 위해 텍스트를 사용한 채팅 또한 WebRTC를 사용할 수 있도록 만들었습니다.
 - 주요 편의 기능 - 하향식뷰: 군에서 채팅을 할 때에 가장 중요한 것은 상급자의 명령입니다. 채팅방 마다 상급자를 설정할 수 있습니다. 하향식뷰를 활성화하면 해당 채팅방에 있는 상급자들의 채팅만 요약되어 보여지고 나머지 채팅들은 열고 닫을 수 있는 상태가 됩니다.
 - 주요 편의 기능 - 유통기한: 군의 메시지들은 유출되면 안되기에 최대한 빠르게 메시지를 삭제하도록 채팅방마다 자동 삭제 시간을 설정할 수 있습니다.  

## 컴퓨터 구성 / 필수 조건 안내 (Prerequisites)
* 앱 필수 요건: Android x.x 버전 이상
* 웹 필수 요건: Chrome x.x버전 이상, Firefox x.x버전 이상 

## 기술 스택 (Technology Used) 
### Server(back-end)
 - Node.js 16.13.0 
 - Express
 - WebSocket(Socket.io)
 - WebRTC (react-native-webrtc)
 - DB not yet decided
 
### Front-end
 -  React Native
 
## 설치 안내 (Installation Process)
```bash
$ git clone https://github.com/osamhack2022/APP_Meerkat_IQDan.git
$ yarn or npm install
$ yarn start or npm run start
```

## 프로젝트 사용법 (Getting Started)
--
 
## 팀 정보 (Team Information)
- 이세호 (koolee33@gmail.com), Github Id: seho0808
- 전형록 (@gmail.com), Github Id: exqt
- 정혜일 (@gmail.com), Github Id: hyelie
- 임동진 (@gmail.com), Github Id: djlim98

## 저작권 및 사용권 정보 (Copyleft / End User License)
 * [MIT](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/license.md)

This project is licensed under the terms of the MIT license.
