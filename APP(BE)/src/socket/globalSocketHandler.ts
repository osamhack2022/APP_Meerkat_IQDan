import { Namespace, Socket } from "socket.io"

// global socket event handler
export default (io: Namespace, socket: Socket) =>{
    // connection 시 속해있는 모든 room에 join시킴
    socket.on("connectionJoinRoom", (chatroomIds: number[]) =>{
        chatroomIds.forEach((chatroomId)=>{
            socket.join(chatroomId.toString());
            // TODO : console log는 디버깅용, 추후 완성되면 삭제
            console.log("global room " + chatroomId + "에 사용자 " + socket.handshake.auth.userId + "접속");
            socket.emit("connectionJoinRoomDebug", chatroomId + "에 접속함.");
            //////////////
        });
    });
};
