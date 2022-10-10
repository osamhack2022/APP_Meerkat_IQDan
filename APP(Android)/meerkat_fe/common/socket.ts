import { io, Socket } from "socket.io-client";
import env from "../env.json";

export function getEmptySocketIO(): Socket {
    return io(env.dev.apiBaseUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 0,
      autoConnect: false
    });
  }