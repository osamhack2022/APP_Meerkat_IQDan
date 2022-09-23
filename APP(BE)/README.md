# MeerKat
해커톤 준비 - 미어캣

docker-compose.yml : 백엔드와 연결을 위한 mysql 생성 도커 컴포즈 파일. 도커는 아래와 같이 실행할 수 있다.
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

이후 다음 명령어를 실행해서 root 사용자가 모든 접근으로부터 허용되게 바꾼다.
```
docker-compose up -d
docker exec -it local-mysql mysql -u root -p
Enter password: password

mysql> grant all privileges on *.* to 'root'@'%';
mysql> create database dev;
mysql> create database prod;
```

이후 prisma를 실행시킨다.
```
cd backend
npm run prisma:init
```
