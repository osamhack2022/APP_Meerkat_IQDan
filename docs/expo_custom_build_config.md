# expo-dev-client 빌드 하는 법

#### Android SDK 인스톨
```
sudo apt update && sudo apt install android-sdk
```

#### .bashrc 설정
```
export ANDROID_HOME=/lib/android-sdk/ # 자신의 설치 경로 맞는지 확인할 것.
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
export SEHOFEDIR=/workspaces/APP_Meerkat_IQDan/'APP\(Android\)'/meerkat_fe # 자신의 이름으로 사용. cd $SEHOFEDIR하면 편리함.
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

