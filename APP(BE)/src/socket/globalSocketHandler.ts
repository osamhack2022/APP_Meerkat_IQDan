import { Namespace, Socket } from "socket.io"

// global socket event handler
export default (io: Namespace, socket: Socket) =>{
    // connection 시 속해있는 모든 room에 join시킴
    //
    socket.on("client:joinAllChatrooms", (chatroomIds: number[]) =>{
        chatroomIds.forEach((chatroomId)=>{
            socket.join(chatroomId.toString());
        });
    });
};
