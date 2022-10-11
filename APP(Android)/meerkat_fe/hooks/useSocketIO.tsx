// chat
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getEmptySocketIO } from '../common/socket';
import env from "../env.json";


/**
 * use socket only when connected.
 * ex)
 * if(socket.connected && isSocketConneted){
 *     socket.emit("event name", "event body")
 * }
 * @returns 
 */
export function useSocketIO(isNotLoggedIn: boolean, attachFunction:Function | null) {
  const [socket, setSocket] = useState<Socket>(getEmptySocketIO);

  // create socket connection when login state changes.
  useEffect(() => {
    if(isNotLoggedIn){
      socket.removeAllListeners();
      socket.disconnect();
      return;
    }
    AsyncStorage.getItem('userToken').then(userToken => {
      setSocket(
        io(env.prod.apiBaseUrl + '/chat', {
          path: '/socket.io',
          transports: ['websocket'],
          reconnectionAttempts: 2,
          auth: { token: userToken },
        }),
      );
    });

    // cleanup
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [isNotLoggedIn]);

  useEffect(()=> {
    // empty socket은 socket.auth가 undefined입니다.
    if(socket.auth !== undefined && attachFunction !== null){
      attachFunction(socket);
    }
  }, [socket]);

  return { socket };
}