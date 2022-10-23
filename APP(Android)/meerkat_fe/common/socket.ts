import { io, Socket } from 'socket.io-client';
import env from '../env.json';

export function getEmptySocketIO(): Socket {
  return io("https://code.seholee.com:8090", {
    path: '/socket.io',
    transports: ['websocket'],
    reconnectionAttempts: 0,
    autoConnect: false,
  });
}
