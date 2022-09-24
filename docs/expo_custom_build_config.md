# expo-dev-client 빌드 하는 법

#### Android SDK 인스톨
```
sudo apt update && sudo apt install android-sdk
```


#### .bashrc 설정
```
export ANDROID_HOME=/lib/android-sdk # 자신의 설치 경로 맞는지 확인할 것.
export PATH=$PATH:$ANDROID_HOME/tools/:$ANDROID_HOME/platform-tools/
export SEHOFEDIR=/workspaces/APP_Meerkat_IQDan/'APP\(Android\)'/meerkat_fe # 자신의 이름으로 사용. cd $SEHOFEDIR하면 편리함.
```

#### Android License 수락
```
wget https://dl.google.com/android/repository/commandlinetools-linux-6609375_latest.zip
unzip commandlinetools-linux-6609375_latest.zip -d cmdline-tools
mkdir --parents "$ANDROID_HOME/cmdline-tools/latest"
sudo mv cmdline-tools/* "$ANDROID_HOME/cmdline-tools/latest/"
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
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

