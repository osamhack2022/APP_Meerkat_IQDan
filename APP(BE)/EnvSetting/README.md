폴더 구성은 다음와 같습니다.
```
EnvSetting
├── docker-compose.yml                              # MariaDB 구성을 위한 docker-compose 파일
├── .env.development.local                          # local 개발환경에서 사용할 DB 접속 계정 정보
├── .env.example                                    # .env파일 예시
├── mariadb
│   ├── conf.d
│   │   └── my.cnf                                # DB에서 사용할 config 파일     
│   ├── data
│   └── initdb.d                                   # DB가 시작될 때 실행 될 SQL들
│       ├── allow_external_connection.sql       
│       └── create_databases.sql
└── README.md
```