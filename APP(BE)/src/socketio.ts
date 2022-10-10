import http from "http";
import https from "https";
import { Server, Socket } from "socket.io"
import { MessageDto } from "@interfaces/message.interface"
import { validateSocketToken } from "./middlewares/auth.middleware";

class SocketIO{
    private ioServer: Server;

    // TODO : header 검증
    // socketio option 중 auth 찾아보면 됨
    // https://www.npmjs.com/package/socketio-auth
    // https://socket.io/docs/v3/client-initialization/

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
            // token validator middleware. if unauthorized, then disconnect.
            console.log("chat namespace new user");
            console.log(socket.handshake.auth);
            socket.use((connection, next)=>{
                console.log("in valid");
                validateSocketToken(socket.handshake.auth, next);
                console.log("validation end, uid: " + socket.handshake.auth.userId);
            });

            // default
            this.onError(socket);
            this.onConnectError(socket);
            this.onDisconnect(socket);

            // global socket
            // TODO 모든 메시지 방별로 받아와서 socket 전송해야 함.
            this.onConnectionJoinRoom(socket); // connection 시 속해있는 모든 room에 join시킴

            // room socket
            this.onJoinRoom(socket);
            this.onSpeakMessage(socket);

           
            
            // this.onLeaveRoom(socket);
            // this.onSendMessage(socket);

        });


        // 다른 connection일 경우 쳐냄.
        this.ioServer.on("connection", (socket: Socket) => {
            console.log("disconnect default connection");
            socket.disconnect();
        });
    }


    //////////////////////// global ////////////////////////
    // socket 접속 시 FE에서 방 목록을 받아와서, 그 방에 전부 join시킴.
    // 방에 누군가를 초대해서 새 사람이 들어올 때는, 그 사람이 'OO가 들어왔습니다' 발송하고, 메시지를 서버에 기록으로 남기는게 맞을듯.
    private onConnectionJoinRoom(socket: Socket){
        socket.on("connectionJoinRoom", (chatroomIds: number[]) =>{
            chatroomIds.forEach((chatroomId)=>{
                socket.join(chatroomId.toString());
                // TODO : console log는 디버깅용, 추후 완성되면 삭제
                console.log("room " + chatroomId + "에 사용자 " + socket.handshake.auth.userId + "접속");
                socket.emit("connectionJoinRoomDebug", chatroomId + "에 접속함.");
                //////////////
            });
        });
    }

    //////////////////////// room ////////////////////////
    private onJoinRoom(socket:Socket){
        socket.on("joinRoom", (roomId: number) =>{
            // TODO  console log는 디버깅용, 추후 완성되면 삭제
            console.log("room " + roomId + "에 사용자 " + socket.handshake.auth.userId + "접속");
            //
            socket.join(roomId.toString());
        });
    }

    private onSpeakMessage(socket: Socket){
        socket.on("speakMessage", (message: MessageDto) =>{
            console.log(message);
            socket.broadcast.to(message.roomId.toString()).emit("hearMessage", message);
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("room " + message.roomId + "에 사용자 " + socket.handshake.auth.userId + "가 메시지 " + message.content + "를 보냄."); 
            //socket.emit("hearMessage", message);
            // this.ioServer.in("2").emit("hearMessage", message);
            // socket.emit("hearMessage", message);
            //////////////
            
        })
    }

    //////////////////////// default ////////////////////////
    private onError(socket:Socket){
        socket.on("error", (err) =>{
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("오류 발생" + err);
            socket.disconnect();
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
}

export default SocketIO;

// socket.broadcast.to(roomid).emit -> socket caller빼고 room에 있는 사람에게 전달
// this.ioServer.in(roomdid).emit -> room에 있는 모든 사람에게 전달