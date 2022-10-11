import { Namespace, Socket } from "socket.io"

// default socket event handler
export default (io: Namespace, socket: Socket) =>{
    socket.on("error", (err) =>{
        // TODO : console log는 디버깅용, 추후 완성되면 삭제
        console.log("오류 발생" + err);
        socket.disconnect();
    });

    socket.on("connect_error", (err) =>{
        // TODO : console log는 디버깅용, 추후 완성되면 삭제
        console.log("connection 오류 발생" + err);
    });

    socket.on("disconnect", () =>{
        // TODO : console log는 디버깅용, 추후 완성되면 삭제
        console.log("chat user disconnected");
    });
};