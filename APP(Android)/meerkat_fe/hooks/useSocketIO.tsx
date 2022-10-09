// chat
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { LoginContext } from '../common/Context';

export function getEmptySocketIO(): Socket {
  return io('https://dev.hyelie.site:8090/', {
    path: '/socket.io',
    transports: ['websocket'],
    reconnectionAttempts: 0,
  });
}

/**
 * use socket only when connected.
 * ex)
 * if(socket.connected && isSocketConneted){
 *     socket.emit("event name", "event body")
 * }
 * @returns 
 */
export function useSocketIO() {
  const [socket, setSocket] = useState<Socket>(getEmptySocketIO);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const { isNotLoggedIn } = useContext(LoginContext);

  // create socket connection when login state changes.
  // useEffect(() => {
  //   AsyncStorage.getItem('userToken').then(userToken => {
  //     setSocket(
  //       io('https://dev.hyelie.site:8090/chat', {
  //         path: '/socket.io',
  //         transports: ['websocket'],
  //         reconnectionAttempts: 2,
  //         auth: { token: userToken },
  //       }),
  //     );
  //   });    
  // }, [isNotLoggedIn]);

  // useEffect(()=>{
  //   initSocketIO(socket);
  //   setIsSocketConnected(socket.connected);

  //   // cleanup
  //   return () => {
  //     socket.removeAllListeners();
  //     socket.disconnect();
  //   };
  // }, [socket])

  // updated connected state
  useEffect(() => {
    socket.connected === true
      ? setIsSocketConnected(true)
      : setIsSocketConnected(false);
  }, [socket.connected]);

  return { socket, isSocketConnected };
}

// set all of socketio events in this function
function initSocketIO(socket: Socket) {
  socket.on('connect', () => {
    // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
    console.log('--------------- socket ---------------');

    // TODO : 재접속 시 DB에서 속해있는 모든 방의 정보를 가져온 후, 그 방에 전부 접속해야 함.
  });

  socket.on("disconnect", () => {
    console.log('--------------- disconnected ---------------' + socket.id);
  });

  // if connection error occurs, then use polling first
  socket.on('connect_error', err => {
    // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
    console.log('connection error : ' + err.message);
  });

  socket.io.on('error', error => {
    console.log('socket connect error: ' + error);
  });

  socket.io.on('reconnect', attempt => {
    console.log(attempt + '만에 재시도 성공');
  });

  socket.io.on('reconnect_attempt', attempt => {
    console.log('재시도 횟수 : ' + attempt + socket.auth);
  });

  socket.io.on('reconnect_error', error => {
    console.log('재연결 시도 실패: ' + error);
  });

  socket.io.on('reconnect_failed', () => {
    console.log('socket reconnect faile ');
  });

  // TODO : client 단에서는 volatile 쓰면 안됨. + if(socket.connected)일 때 socket.emit() 하는 것으로.
  // ex)
  // let count = 0;
  // setInterval(() => {
  //     if(socket.connected){
  //         socket.timeout(5000).emit('testsend', ++count);
  //     }
  // }, 2000);
}
