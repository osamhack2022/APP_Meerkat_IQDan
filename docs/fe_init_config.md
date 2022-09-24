# React Native 초기 설정
#### Typescript로 create-expo-app
```
npx create-expo-app -t expo-template-blank-typescript
```
위 커맨드 실행 후 프로젝트 이름을 입력

#### Android SDK 인스톨
```
sudo apt update && sudo apt install android-sdk
export ANDROID_HOME=/usr/lib/android-sdk/ # 설치 경로 맞는지 확인하고 환경변수 설정.
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### expo-dev-client 설정
```
npx expo install expo-dev-client
```
