// chat
import { io, Socket } from "socket.io-client";

// set all of socketio events in this function
export default function getSocketIO(): Socket{
    const socket = io("https://dev.hyelie.site:8090/chat", {path:"/socket.io", transports:["websocket"]});

    // TODO : header에 token 추가
    // socketio option 중 auth 찾아보면 됨

    socket.on("connect", () => {
        // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
        console.log('connected --------------- socket ---------------');


    });

    // if connection error occurs, then use polling first
    socket.on("connect_error", (err) =>{
        socket.io.opts.transports = ["polling", "websocket"];
        // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
        console.log(err.message);
    });



    return socket;
}
