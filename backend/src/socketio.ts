import http from "http";
import { Server, Socket } from "socket.io"
import { Message } from "@interfaces/message.interface"

class SocketIO{
    private io: Server;

    constructor(httpServer: http.Server){
        this.io = new Server(httpServer, {
            cors: {
                origin: "*",
            },
            path: "/socket.io/",
            transports: ["websocket", "polling"]
        });

        this.io.on("connection", (socket: Socket) => {
            console.log("new user connected");

            this.onDisconnect(socket);
            this.onJoinRoom(socket);
            this.onLeaveRoom(socket);
            this.onSendMessage(socket);
            this.onError(socket);
            this.onConnectError(socket);
        }); 
    }

    private onError(socket:Socket){
        socket.on("error", (err) =>{
            console.log("오류 발생" + err);
        })
    }

    private onConnectError(socket:Socket){
        socket.on("connect_error", (err) =>{
            console.log("connection 오류 발생" + err);
        })
    }

    private onDisconnect(socket: Socket){
        socket.on("disconnect", () =>{
            console.log("a user disconnected");
        })
    }

    private onJoinRoom(socket: Socket){
        socket.on("joinRoom", (message: Message) =>{
            socket.join(message.room);
            this.io.to(message.room).emit("joinRoom", message);
            console.log("room " + message.room + "에 사용자 " + message.user.id + "접속");
        });
    }

    private onLeaveRoom(socket: Socket){
        socket.on("leaveRoom", (message: Message) =>{
            socket.leave(message.room);
            this.io.to(message.room).emit("leaveRoom", message);
            console.log("room " + message.room + "에 사용자 " + message.user.id + "접속 종료");
        })
    }

    private onSendMessage(socket: Socket){
        socket.on("sendMessage", (message: Message) =>{
            console.log("room " + message.room + "에 사용자 " + message.user.id + "가 메시지 " + message.content + "를 보냄.");
            this.io.to(message.room).emit("sendMessage", message);
        })
    }
}

export default SocketIO;