import { Namespace, Socket } from "socket.io"

/**
 * default socket event handler
 * 오류나 에러 발생 시 처리하는 socket event handler입니다.
 * @on error
 * @on connect_error
 * @on disconnect
 */
export default (io: Namespace, socket: Socket) =>{
    socket.on("error", (err) =>{
        ////////// DEBUG : debug용 console log ////////
        console.log("오류 발생" + err);
        ///////////////////////////////////////////////
        socket.disconnect();
    });

    socket.on("connect_error", (err) =>{
        ////////// DEBUG : debug용 console log ////////
        console.log("connection 오류 발생" + err);
        ///////////////////////////////////////////////
    });

    socket.on("disconnect", () =>{
        ////////// DEBUG : debug용 console log ////////
        console.log("chat user disconnected");
        ///////////////////////////////////////////////
    });
};