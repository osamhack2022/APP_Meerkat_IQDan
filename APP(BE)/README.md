# Meerkat backend
해당 프로젝트는 [typescript-express-starter](https://www.npmjs.com/package/typescript-express-starter)로 구성되었으며, template는 prisma를 선택했다. [git 링크](https://github.com/ljlm0402/typescript-express-starter)

<br>

## 환경 구성
### NVM
codespace에는 기본적으로 nvm이 설치되어 있다. 설치되어 있지 않은 경우는 다음과 같이 nvm을 설치한다. [링크](https://hyelie.tistory.com/entry/Install-NVM-typescript-express-starter-on-Ubuntu)

아래 명령어를 실행시켜서 Node v16.17.0 (LTS)를 실행할 것이다.
```
nvm install 16.17.0
nvm use 16.17

$ nvm -v
0.38.0
$ npm -v
8.15.0
$ node -v
v16.17.0
```
<br>

### 개발용 local mysql 설치
codespace에는 docker와 docker-compose도 설치되어 있다.docker를 이용해 mysql을 올릴 것이다.

만약 docker나 docker-compose가 없다면 아래 명령어로 docker, docker-compose를 설치한다.

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

localEnvSetting/docker-compose.yml이 개발용 local mysql을 올리기 위한 파일이다. 해당 파일을 실행시킬 경우 localEnvSetting 폴더에 dockervolume 폴더가 생성되며, 해당 폴더는 mysql의 database, table, row들이 저장된다.

아래 명령어로 mysql을 실행시키자.

```
docker-compose -f ./localEnvSetting/docker-compose.yml up -d
```
<br>

이후 다음 명령어를 실행해서 생성한 mysql container에 및 접속하고 개발에 사용할 'root' 사용자가 모든 접근으로부터 허용되게 바꾸고 개발용 schema 이외에 test, 배포용 schema도 생성한다.

```
docker ps
docker exec -it local-mysql mysql -u root -p
Enter password: password

mysql> grant all privileges on *.* to 'root'@'%';
mysql> create database prod;
mysql> create database test;
```
<br>

이후 prisma를 실행시킨다. 해당 명령어를 실행시키기 위해서는 package.json의 script에 있는 .env 파일이 존재해야 하며, .env.development 파일만 remote 서버에 올려두었다.
```
npm run prisma:migrate:dev       # mysql dev schema에 반영
npm run prisma:migrate:prod      # mysql prod schema에 반영
npm run prisma:migrate:test      # mysql test schema에 반영
```
<br>

해당 폴더에서 아래 명령어로 서버를 실행시킬 수 있다. 좀 더 자세한 명령어는 package.json의 scripts를 확인하면 된다.
```
npm run dev                      # node로 dev 환경 실행
npm run deploy:dev               # pm2로 dev 환경 실행

npm run deploy:prod              # pm2로 prod 환경 실행
```
<br>

## 로그인 동작
login 시 cookie에 authorization token이 저장되며 

이 토큰 값을 가진 상태로 서버에 request를 보내거나, 또는

이 토큰 값을 Authorization header에 'Bearer [TOKEN]' 형식으로 보내면 응답된다.

<br>

## socket.io 동작 및 설치
client에서 .emit('EVENTNAME')으로 보내면 서버에서 .on('EVENTNAME')으로 받는다.

[공식 문서](https://socket.io/docs/v3/server-initialization/)

아래 명령어로 typescript socketio를 설치 할 수 있다.
```
npm install @types/socket.io
```
<br>