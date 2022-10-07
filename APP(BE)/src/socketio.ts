import http from "http";
import https from "https";
import { Server, Socket } from "socket.io"
import { Message } from "@interfaces/message.interface"

class SocketIO{
    private io: Server;

    constructor(server: http.Server | https.Server){
        this.io = new Server(server, {
            cors: {
                origin: "*",
                credentials: true
            },
            path: "/socket.io",
            transports: ["polling", "websocket"]
        });

        const single = this.io.of("/single");

        single.on("connection", (socket:Socket)=>{
            console.log("single new user");
        })
        
        this.io.on("connection", (socket: Socket) => {
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("default socketio new user connected");

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
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("오류 발생" + err);
        })
    }

    private onConnectError(socket:Socket){
        socket.on("connect_error", (err) =>{
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("connection 오류 발생" + err);
        })
    }

    private onDisconnect(socket: Socket){
        socket.on("disconnect", () =>{
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("a user disconnected");
        })
    }

    private onJoinRoom(socket: Socket){
        socket.on("joinRoom", (message: Message) =>{
            console.log("asdfasdf" + message.roomId);
            socket.join(message.roomId.toString());
            console.log("asdfasdf");
            this.io.to(message.roomId.toString()).emit("joinRoom", message);
            console.log("asdfasdf");
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("room " + message.roomId.toString() + "에 사용자 " + message.userId + "접속");
        });
    }

    private onLeaveRoom(socket: Socket){
        socket.on("leaveRoom", (message: Message) =>{
            socket.leave(message.roomId.toString());
            this.io.to(message.roomId.toString()).emit("leaveRoom", message);
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("room " + message.roomId.toString() + "에 사용자 " + message.userId + "접속 종료");
        })
    }

    private onSendMessage(socket: Socket){
        socket.on("sendMessage", (message: Message) =>{
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("room " + message.roomId.toString() + "에 사용자 " + message.userId + "가 메시지 " + message.content + "를 보냄.");
            this.io.to(message.roomId.toString()).emit("sendMessage", message);
        })
    }
}

export default SocketIO;