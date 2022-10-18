import http from "http";
import https from "https";
import { Server, Socket } from "socket.io"
import MessageSerivce from "@services/message.service";
import globalSocketHandler from "./globalSocketHandler";
import defaultSocketHandler from "./defaultSocketHandler";
import roomSocketHandler from "./roomSocketHandler";
import socketMiddleware from "./socketMiddleware";
import AllClearSerivce from "@/services/allclear.service";

class SocketIO{
    private ioServer: Server;
    private messageService = new MessageSerivce();
    private allClearService = new AllClearSerivce();

    constructor(server: http.Server | https.Server){
        this.ioServer = new Server(server, {
            cors: {
                origin: "*",
                credentials: true
            },
            path: "/socket.io",
            transports: ["websocket", "polling"],
        });

        const chatio = this.ioServer.of("/chat");
        chatio.on("connection", (socket:Socket)=>{
            // TODO : debug용 console log
            console.log("chat namespace new user!!");

            // token validator middleware. if unauthorized, then disconnect.
            socketMiddleware(chatio, socket);
            // socket.handshake.auth.userId => userId value가 나옴.
            
            // default socket
            defaultSocketHandler(chatio, socket);
            // global socket
            globalSocketHandler(chatio, socket);
            // room socket
            roomSocketHandler(chatio, socket, this.messageService, this.allClearService);
        });


        // 다른 connection일 경우 쳐냄.
        this.ioServer.on("connection", (socket: Socket) => {
            // TODO : debug용 console log
            console.log("disconnect default connection");
            socket.disconnect();
        });
    }
}

export default SocketIO;

// socket.broadcast.to(roomid).emit -> socket caller빼고 room에 있는 사람에게 전달
// this.ioServer.in(roomdid).emit -> room에 있는 모든 사람에게 전달