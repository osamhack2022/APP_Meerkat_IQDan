# 미어캣 - 빠르고 안전한 군용 채팅앱

<p align="center">
	<img src="./.images/logo.png">
</p>

<p align="center">
	<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/graphs/contributors/"><img alt="GitHub contributors" src="https://img.shields.io/github/contributors/osamhack2022/APP_Meerkat_IQDan?color=success"></a>
	<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/osamhack2022/APP_Meerkat_IQDan"></a>
	<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/issues"><img alt="GitHub forks" src="https://img.shields.io/github/issues/osamhack2022/APP_Meerkat_IQDan"></a>
	<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/issues"><img alt="GitHub forks" src="https://img.shields.io/github/issues-closed/osamhack2022/APP_Meerkat_IQDan"></a>
	<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/license.md"><img alt="GitHub license" src="https://img.shields.io/github/license/osamhack2022/APP_Meerkat_IQDan"></a>
</p>


<p align="center">
<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki">개발 위키</a> 
| 
<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/meerkat_presentation.pdf">발표 자료</a> 
| 
<a href="">시연 영상</a>
|
<a href="https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/%EB%8D%B0%EB%AA%A8-%EC%82%AC%EC%9A%A9%EB%B2%95-%EB%B0%8F-FAQ">apk 다운로드</a>
</p>




## :telescope: 프로젝트 소개 (Why Meerkat?)

수많은 장병들이 편의를 위해 **카카오톡과 같은 서드파티 메신저앱들을 암암리**에 사용하고 있습니다. 훈련 중에는 사용하지 않아도, 훈련 이후 **사후 평가**나 평시 **명령 하달** 및 **보고** 시 자주 사용되고 있습니다. 이런 앱들의 문제점은 군 내부의 정보들이 이러한 **민간 서버들에 암호화조차 되지 않고 남을 때가 많다**는 것입니다. 만약 암호화 되지 않은 정보가 적에게 유출될 시 매우 큰 약점으로 작용할 수 있습니다.

미어캣은 현재 장병들이 사용중인 채팅앱들의 ***보안 대책***을 마련함과 동시에 ***군에 특화된 채팅 기능***들을 제공합니다.

:dark_sunglasses: 미어캣으로 **더욱 안전한 채팅**이 가능합니다. <br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: :link:**종단간 암호화**는 기기 밖에 있는 모든 메시지를 암호화합니다. [#](#e2ee) <br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: :anchor:**2차 비밀번호**는 휴대폰에 저장되어있는 메시지 또한 암호화합니다. [#](#2ndpw)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: 서버와 채팅방 멤버들의 :angel:**메시지 자동 삭제 주기**를 정할 수 있습니다. [#](#expiry)

 
:racehorse: 미어캣으로 **유례없는 신속한 의사소통**이 가능합니다. <br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: 반복되는 **보고 양식을 저장**할 수 있는 :zap:**충성템플릿** [#](#template)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: **상급자의 메시지를 요약**해주는 :star2:**명령 요약** [#](#summarize)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: 소대 인원들의 보고를 빛처럼 빠르게 받아볼 수 있는 :kick_scooter:**이상무 보고** [#](#noprob)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;:heavy_check_mark: 전우들의 근황을 살필 수 있는 군인 특화 :crossed_swords:**전우 목록** [#](#friends)

## :bow_and_arrow: 기능설명 (Features)
### :lock: 1. 보안 기능 <a name="e2ee"></a> 


|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/wiki/e2ee/normal-chat.png?raw=true)|
|:---:|
| :link: **종단간 암호화 (End-to-end Encryption)** <a name="2ndpw"></a>|
| 종단간 암호화를 통해 서버에 남기는 기록들을 암호화합니다. <br> 서버에서도 암호화 된 내용을 알 수 없고 오로지 채팅하는 유저들끼리만 내용을 알 수 있습니다. <br> 자세한 내용은 [Wiki](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/%EC%A2%85%EB%8B%A8%EA%B0%84-%EC%95%94%ED%98%B8%ED%99%94-(End-to-end-Encryption))에서 확인할 수 있습니다. | 

|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/ui-2ndpassword.png?raw=true)|
|:---:|
|:anchor: **2차 비밀번호** <a name="expiry"></a>|
|채팅 기록이 개인 휴대폰에 평문으로 남게되면 누군가 휴대폰을 훔쳐 내용을 보거나 스파이웨어에 의해 정보가 유출될 수 있습니다. 미어캣의 2차 비밀번호 기능을 사용하면 휴대폰에 저장되는 채팅방 내용도 암호화하여 안전하게 채팅 기록을 저장할 수 있습니다.|

|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/ui-deletion.png?raw=true)|
|:---:|
|:angel:**메세지 유통기한**| 
|군의 메시지들은 유출되면 안되기에 최대한 빠르게 메시지를 삭제하도록 채팅방마다 자동 삭제 시간을 설정할 수 있습니다.|

### :speech_balloon: 2. 군용 채팅 기능 <a name="template"></a>
|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/ui-template.png?raw=true)|
|:---:|
|:zap: **충성템플릿** <a name="summarize"></a>|
|여러가지 격식을 갖추거나 명령 하달 관련 템플릿을 작성/사용/공유할 수 있습니다.|

|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/ui-summary.png?raw=true)|
|:---:|
|:star2: **명령요약** <a name="noprob"></a>|
|군에서 채팅을 할 때에 가장 중요한 것은 상급자의 명령입니다. 활성화 시 최상급자의 메시지만 보여집니다.|

|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/ui-noproblem.png?raw=true)|
|:---:|
|:kick_scooter: **이상무 보고** <a name="friends"></a>|
|분대장, 소대장, 중대장 등이 각종 보고를 빠르게 받아볼 수 있는 기능입니다.|

|![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/ui-friends.png?raw=true)|
|:---:|
|:crossed_swords: **전우 목록**| 
|전우들의 전역일, 근황 등을 살펴볼 수 있습니다.|

## :milky_way: 컴퓨터 구성 / 필수 조건 안내 (Prerequisites)
### :calling: Mobile
|Expo|Android|iOS|
|:---:|:---:|:---:|
|SDK 46+|Android 5.0+|iOS 12.4+|

### :hammer: DevTools
|Docker|Nginx|MariaDB|
| :--: | :--: | :--: |
|20.0+|1.22+|10.6+|

## :bento: 기술 스택 (Technology Used) 
<img src="./.images/tech_stacks.png">

### Frontend

- [React Native](https://reactnative.dev/) - React.js를 사용한 Cross-Platform 앱 프레임워크 
- [Expo](https://expo.dev/) - React Native 개발/배포를 쉽게 도와주는 플랫폼

### Backend

- [Node.js](https://nodejs.org/ko/) - 비동기 서버용 JavaScript 런타임
- [Express.js](https://expressjs.com/) - Node.js용 웹 애플리케이션 프레임워크
- [Socket.io](https://socket.io/) - WebSocket을 통한 실시간 통신 라이브러리
- [MariaDB](https://mariadb.org/) - MySQL에 기반을 둔 관계형 데이터베이스 관리 시스템
- [Prisma](https://www.prisma.io/) - Node.js와 Typescript를 위한 ORM (Object Relational Mapping)

### Design & Collaboration 

- [Figma](https://www.figma.com/) - 인터페이스 디자인을 위한 웹 기반 협업 툴
- [Zoom](https://zoom.us/) - 화상 회의 
- [Github](https://github.com/) - Git협업 오픈소스 플랫폼
- [Google slides](https://www.google.com/intl/ko_kr/slides/about/) - 협업 가능한 웹 기반 프레젠테이션 제작 툴

### DevOps

- [Github codespace](https://github.com/features/codespaces) - 웹 브라우저에서 돌아가는 클라우드 기반 개발 플랫폼
- [Pm2](https://pm2.keymetrics.io/) - Node.js 프로세스 매니저
- [Nginx](https://www.nginx.com/) - 가벼움과 높은 성능을 목표로하는 웹 서버
- [Letsencrypt](https://letsencrypt.org/ko/) - 무료로 TLS 인증서를 발급해주는 비영리 기관 
- [Docker](https://www.docker.com/) - 응용 프로그램들을 프로세스 격리 기술을 사용해 컨테이너 단위로 실행하고 관리

## :taco: 프로젝트 사용법 (Getting Started)
### Clone
먼저 프로젝트를 clone해줍니다.
```bash
# 프로젝트 clone
git clone https://github.com/osamhack2022/APP_Meerkat_IQDan.git
```

### Backend
Docker, SSL, MariaDB 설정 후 아래 커맨드들로 실행할 수 있습니다.
자세한 사항은 [Backend 위키 문서](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/Backend-%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95)를 참고해주세요.
```bash
npm i
npm run prisma:migrate:dev       # schema.prisma 변경 사항 반영
npm run dev                      # node로 dev 환경 실행
npm run deploy:dev               # pm2로 dev 환경 실행
```

### Frontend
npm install 이후 Expo Go앱으로 실행할 수 있습니다. 자세한 사항은 [Frontend 위키 문서](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/Frontend-%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95)를 참고해주세요
```bash
npm i
npx expo start --tunnel # dev용 expo go 실행
npx expo build --profile preview # apk 빌드
```

## :open_hands: 기여 방법
개발을 시작하기 전에 [Meerkat 개발 규칙](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/%EA%B0%9C%EB%B0%9C-%EA%B7%9C%EC%B9%99)을 꼭 읽어 주세요.
1. [https://github.com/osamhack2022/APP_Meerkat_IQDan/fork](https://github.com/osamhack2022/APP_Meerkat_IQDan/fork)에서 해당 레포지토리를 fork합니다
2. [Frontend 실행 방법](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/Frontend-%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95), [Backend 환경 구성](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/Backend-%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95)을 참고해 개발 환경을 설정합니다.
2. [Meerkat Git 규칙](https://github.com/osamhack2022/APP_Meerkat_IQDan/wiki/%EA%B0%9C%EB%B0%9C-%EA%B7%9C%EC%B9%99#git-%EA%B7%9C%EC%B9%99)을 참고해 `git checkout -b [Github ID]/[feature]` 명령어로 새 브랜치를 만듭니다.
3. `git stash` - `git fetch origin` - `git rebase -i origin` 이후에 `git add`, `git commit`으로 커밋합니다.
4. `git push origin [Github ID]/[feature]` 명령어로 브랜치에 푸시합니다.
5. pull request를 보내주세요.
 
## :baby: 팀 정보 (Team Information)
|이름|역할|Github|Contact|
|:---|----|----|----|
|팀장 이세호|PM, 풀스택 개발|<a href="https://github.com/seho0808"><img src="http://img.shields.io/badge/seho0808-green?style=social&logo=github"/></a>|<a href="koolee33@gmail.com"><img src="https://img.shields.io/badge/koolee33@gmail.com-green?logo=gmail&style=social"/></a>
|정혜일|풀스택 개발|<a href="https://github.com/hyelie"><img src="http://img.shields.io/badge/hyelie-green?style=social&logo=github"/></a>|<a href="hyelie@postech.ac.kr"><img src="https://img.shields.io/badge/hyelie@postech.ac.kr-green?logo=microsoft-outlook&style=social"/></a>|
|전형록|프론트엔드 개발|<a href="https://github.com/exqt"><img src="http://img.shields.io/badge/exqt-green?style=social&logo=github"/></a>|<a href="dashchan@naver.com"><img src="https://img.shields.io/badge/dashchan@naver.com-green?logo=naver&style=social"/></a>|
|임동진|백엔드 개발 및 UI 디자인|<a href="https://github.com/djlim98"><img src="http://img.shields.io/badge/djlim98-green?style=social&logo=github"/></a>|<a href="ehdwlsdudwo1@gmail.com"><img src="https://img.shields.io/badge/ehdwlsdudwo1@gmail.com-green?logo=gmail&style=social"></a>|

## :kiwi_fruit: 저작권 및 사용권 정보 (Copyleft / End User License)
 * [MIT](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/license.md)

This project is licensed under the terms of the MIT license.
