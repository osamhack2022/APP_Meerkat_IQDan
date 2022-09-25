# Meerkat backend
해당 프로젝트는 [typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter)로 구성되었으며, template는 prisma를 선택했습니다. [git 링크](https://github.com/ljlm0402/typescript-express-starter)

<br>

## 초기 환경 구성
### NVM
#### NVM 설치
codespace에는 기본적으로 NVM이 설치되어 있습니다만, NVM이 설치되어 있지 않다면 다음과 같이 NVM을 설치합니다. NVM 버전은 공식 github에서 버전을 확인할 수 있습니다. [NVM 공식 github](https://github.com/nvm-sh/nvm/#install--update-script)

```
# vx.xx.x부분의 버전은 공식 git에서 확인 한 후 변경
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/vx.xx.x/install.sh | bash

ex) curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

$ nvm -v
0.38.0
```
<br>

#### Node 버전 설정
NVM이 설치되어 있다면 아래 명령어를 실행시켜서 Node v16.17.0 (LTS)를 설정합니다.
```
nvm install 16.17.0
nvm use 16.17

$ npm -v
8.15.0
$ node -v
v16.17.0
```
<br>

### 개발용 local MariaDB 설치
#### docker와 docker-compose 설치
codespace에는 docker와 docker-compose도 설치되어 있습니다만, docker나 docker-compose가 없다면 아래 명령어로 docker, docker-compose를 설치합니다.

```
# docker 설치
sudo apt-get update && sudo apt-get upgrade
sudo curl -fsSL https://get.docker.com/ | sudo sh
sudo chmod 777 /var/run/docker.sock
docker ps

# docker-compose 설치
sudo curl -L https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version 
```
<br>

#### docker에 local 개발용 MariaDB 올리기
docker-compose를 이용해 MariaDB를 올릴 것입니다.

EnvSetting/docker-compose.yml 파일이 개발용 local MariaDB를 올리기 위한 파일입니다. 해당 파일을 실행시킬 경우 EnvSetting/mariadb 폴더에 MariaDB의 database, table, row들이 저장되며, 해당 컨테이너의 DB 접속 계정 정보는 환경 설정 파일인 EnvSetting/.env.development.local에 있습니다.

아래 명령어로 개발용 local MariaDB을 실행시킵니다.
```
# local 개발용 MariaDB 환경 설정
docker-compose -f ./EnvSetting/docker-compose.yml --env-file ./EnvSetting/.env.development.local up -d
```
<br>

#### MariaDB test/production 환경 설정
개발 이외의 환경 설정을 원하는 경우 [예시 파일](./EnvSetting/.env.example)과 [EnvSetting 폴더 구조](./EnvSetting/README.md), [공식 문서](https://github.com/docker-library/docs/tree/master/mariadb#environment-variables)를 참고해서 환경설정 파일을 작성하고, 다음 명령어로 작성한 .env파일을 적용시킨 MariaDB을 실행할 수 있습니다.
```
# ENV_FILE_NAME에는 작성한 환경 설정 파일 경로를 입력합니다.
docker-compose -f ./EnvSetting/docker-compose.yml --env-file ./EnvSetting/[ENV_FILE_NAME] up -d
```
<br>

#### MariaDB 접속
다음 명령어를 실행해서 생성한 MariaDB container에 및 접속할 수 있습니다.
```
docker ps
docker exec -it mariadb mysql -u root -p
Enter password: password
```
<br>

### prisma 실행
prisma를 실행시킵니다. 해당 명령어를 실행시키기 위해서는 package.json의 script에 있는 .env 파일이 존재해야 하며, .env.development 파일만 remote 서버에 올려두었습니다.
```
npm run prisma:migrate:dev       # mariadb dev schema에 반영
npm run prisma:migrate:prod      # mariadb prod schema에 반영
npm run prisma:migrate:test      # mariadb test schema에 반영
```
<br>

### 서버 실행
해당 폴더에서 아래 명령어로 서버를 실행시킬 수 있습니다. 좀 더 자세한 명령어는 package.json의 scripts를 확인하면 됩니다.
```
npm run dev                      # node로 dev 환경 실행
npm run deploy:dev               # pm2로 dev 환경 실행

npm run deploy:prod              # pm2로 prod 환경 실행
```
<br>

## 동작 방식
### 로그인 동작
login 시 cookie에 authorization token이 저장됩니다.

이 토큰 값을 가진 상태로 서버에 request를 보내거나, 또는

이 토큰 값을 Authorization header에 'Bearer [TOKEN]' 형식으로 보내면 응답합니다.

<br>

### socket.io 동작 및 설치
client에서 .emit('EVENTNAME')으로 보내면 서버에서 .on('EVENTNAME')으로 받습니다.

[공식 문서](https://socket.io/docs/v3/server-initialization/)

아래 명령어로 typescript socketio를 설치 할 수 있습니다.
```
npm install @types/socket.io
```
<br>