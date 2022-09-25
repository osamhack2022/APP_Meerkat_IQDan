# Frontend 실행 방법
## Production용 빌드하는 법
--
## Dev용 expo-dev-client 빌드 하는 법

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
chmod -R 777 /lib/android-sdk # codespace의 경우 sudo eas가 안되기에 수동으로 이렇게 해야함.
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

#### 새로운 bash에서 아까 생성된 apk http-server로 열고 서빙하여 폰에서 다운로드
```
npm i -g http-server 
http-server # meerkat_fe 디렉터리 내에서 실행.
```
이후 해당 포트를 ngrok으로 열어줍니다. 코드스페이스는 snap install ngrok이 안되므로 vs code server 익스텐션 ngrok을 받아서
ctrl+shift+p 후 ngrok:start 실행 후 8080같은 포트 번호를 입력하여 열어줍니다. 열린 ngrok url로 폰 접속하여 apk다운로드 받습니다.


