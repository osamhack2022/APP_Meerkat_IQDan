# UI 머리 다 바꾸기
# 움짤 머리 자르기, 자막부분 자르기
# 메시지 삭제 움짤 양쪽에 있는 걸로 바꾸기

## 읽기 전에
Redis Pub/Sub 구조에 대해 이해하고 있어야 합니다. [Redis 공식 문서](https://redis.io/topics/pubsub/)

https://webcache.googleusercontent.com/search?q=cache:WNl9xn-SG4EJ:https://roothyo.tistory.com/50&cd=2&hl=ko&ct=clnk&gl=kr

https://webcache.googleusercontent.com/search?q=cache:qTM1h57qGrkJ:https://2kindsofcs.tistory.com/6&cd=1&hl=ko&ct=clnk&gl=kr

https://socket.io/docs/v4/redis-adapter/

Redis Pub/Sub 구조를 이용한 socket

![](https://github.com/osamhack2022/APP_Meerkat_IQDan/blob/main/.images/wiki/redis-scalability/redis-scalability-architecture.png?raw=true)

1. load balancer로 초기 socket connection을 받음. 해당 과정에서 자신이 접속해 있는 server가 정해짐.

2. socket 할당 후 message 전송 시
빨간 줄 따라감. 자신이 접속한 server에서 redis adapter가 redis pub에 접근,
redis pub가 redis adapter에 event 발생,
해당 redis adapter는 event에 해당하는 room에만 socket event 발생