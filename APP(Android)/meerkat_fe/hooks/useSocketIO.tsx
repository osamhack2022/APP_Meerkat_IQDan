// chat
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { attachSocket, getEmptySocketIO } from '../common/socket';
import env from "../env.json";


/**
 * use socket only when connected.
 * ex)
 * if(socket.connected && isSocketConneted){
 *     socket.emit("event name", "event body")
 * }
 * @returns 
 */
export function useSocketIO(isNotLoggedIn: boolean) {
  const [socket, setSocket] = useState<Socket>(getEmptySocketIO);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  // create socket connection when login state changes.
  useEffect(() => {
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
      if(isNotLoggedIn){
        socket.removeAllListeners();
        socket.disconnect();
      }
  }, [isNotLoggedIn]);

  useEffect(()=>{
    if(isNotLoggedIn === false){
      attachSocket(socket);
      setIsSocketConnected(socket.connected);
    }  

    // cleanup
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket]);

  // updated connected state
  useEffect(() => {
    socket.connected === true
      ? setIsSocketConnected(true)
      : setIsSocketConnected(false);
  }, [socket.connected]);

  return { socket, isSocketConnected };
}