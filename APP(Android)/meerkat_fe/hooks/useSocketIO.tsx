// chat
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// set all of socketio events in this function
export function useSocketIO() {
    const [socket, setSocket] = useState<Socket>(io("https://dev.hyelie.site:8090/chat", {path:"/socket.io", transports:["websocket"], reconnectionAttempts: 3}));
    const [isSocketConnected, setIsSocketConnected] = useState<boolean>(socket.connected);

    // TODO : useContext(AuthContext) 해서 token 가져오기
    // TODO : header에 token 추가
    // socketio option 중 auth 찾아보면 됨

    // initialize socket
    useEffect(()=>{
        initSocketIO(socket);
        setIsSocketConnected(socket.connected);

        // cleanup
        return () =>{
            socket.disconnect();
        }
    }, []);

    // updated connected state
    useEffect(()=>{
        socket.connected === true ? setIsSocketConnected(true) : setIsSocketConnected(false);
    }, [socket.connected])

    return { socket, isSocketConnected };
}

function initSocketIO(socket: Socket){
    socket.on("connect", () => {
        // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
        console.log('connected --------------- socket ---------------');

        // TODO : 재접속 시 DB에서 속해있는 모든 방의 정보를 가져온 후, 그 방에 전부 접속해야 함.
    });

    // if connection error occurs, then use polling first
    socket.on("connect_error", (err) =>{
        socket!.io.opts.transports = ["polling", "websocket"];
        // TODO : console log는 socket 디버깅용, 추후 완성되면 삭제
        console.log(err.message);
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