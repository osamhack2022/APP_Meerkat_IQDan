
import { createContext } from "react";
import { io } from "socket.io-client";
import { getEmptySocketIO } from "./socket";
export const LoginContext = createContext({
    checkIfLoggedIn: () => {},
    isNotLoggedIn: false,
    userId: -1
});

export const SocketContext = createContext({
    socket: getEmptySocketIO()
});