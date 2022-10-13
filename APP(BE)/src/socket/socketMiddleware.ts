import { validateSocketToken } from "@/middlewares/auth.middleware";
import { Namespace, Socket } from "socket.io"

// socket middlewares
export default (io: Namespace, socket: Socket ) =>{
    // socket.handshake.auth.token이 유효하면 next를 던져주고, 아닌 경우 disconnect 시킴.
    socket.use((connection, next)=>{
        // 실행되면 socket.handshake.auth.userId에 userId값이 들어 있음.
        validateSocketToken(socket.handshake.auth, next); 
    });
}