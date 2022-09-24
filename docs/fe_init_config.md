# React Native 초기 설정
#### Typescript로 create-expo-app
```
npx create-expo-app -t expo-template-blank-typescript
```
위 커맨드 실행 후 프로젝트 이름을 입력

#### Android SDK 인스톨
```
sudo apt update && sudo apt install android-sdk
export ANDROID_HOME=/usr/lib/android-sdk/ # 설치 경로 맞는지 확인하고 환경변수 설정. .bashrc에 추가해주어야 매번 자동으로 설정됨.
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### expo-dev-client 설정
```
npx expo install expo-dev-client
npm i -g eas-cli
eas build --profile development --platform android --local # 로컬에서 커스텀 expo dev 앱 빌드하기.
```
project root directory에 eas.json 제작. ([출처](https://docs.expo.dev/build/eas-json/))
```
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

#### expo-dev-client 실행
```
npx expo start --dev-client
```
[출처](https://docs.expo.dev/development/getting-started/)

