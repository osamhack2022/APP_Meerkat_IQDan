import { validateSocketToken } from "@/middlewares/auth.middleware";
import { Namespace, Socket } from "socket.io"

// socket token validator middleware. if unauthorized, then disconnect.
export default (io: Namespace, socket: Socket ) =>{
    // socket.handshake.auth.token이 유효하면 next로 던져주고, 아닌 경우 disconnect 시킵니다.
    socket.use((connection, next)=>{
        // socket.handshake.auth.userId => userId value가 나옵니다.
        validateSocketToken(socket.handshake.auth, next); 
    });
}