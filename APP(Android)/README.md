# expo-dev-client 빌드 하는 법

#### Android SDK와 JDK 인스톨
```
sudo apt update && sudo apt install android-sdk
sudo apt install openjdk-8-jdk
```


#### .bashrc 설정
```
export ANDROID_HOME=/lib/android-sdk # 자신의 설치 경로 맞는지 확인할 것.
export PATH=$PATH:$ANDROID_HOME/tools/:$ANDROID_HOME/platform-tools/
export SEHOFEDIR=/workspaces/APP_Meerkat_IQDan/'APP\(Android\)'/meerkat_fe # 자신의 이름으로 사용. cd $SEHOFEDIR하면 편리함.
```

#### Android License 수락
```
cd /workspaces #혹은 적절한 위치로 이동.
sudo wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip
sudo unzip commandlinetools-linux-8512546_latest.zip
cd cmdline-tools/tools/bin
sudo sdkmanager --sdk_root=$ANDROID_HOME --licenses # 들어가서 모두 y로 수락하면 끝임.
```
위에 수락안하면 아래 build가 안됨.
[출처1](https://stackoverflow.com/questions/53994924/sdkmanager-command-not-found-after-installing-android-sdk)
[출처2](https://stackoverflow.com/questions/54273412/failed-to-install-the-following-android-sdk-packages-as-some-licences-have-not)


#### expo-dev-client 설정
```
npx expo install expo-dev-client
npm i -g eas-cli
eas build --profile development --platform android --local # 로컬에서 커스텀 expo dev 앱 빌드하기.
```
project root directory에 eas.json 제작. [출처](https://docs.expo.dev/build/eas-json/)
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

#### expo-dev-client 실행 [출처](https://docs.expo.dev/development/getting-started/)
```
npx expo start --dev-client
```


