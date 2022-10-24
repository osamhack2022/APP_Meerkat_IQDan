import { Namespace, Socket } from "socket.io"

/**
 * global socket event handler
 * 채팅방 목록에서 읽지 않은 메시지가 쌓이는 기능을 구현하기 위한 socket event handler입니다.
 * @on client:joinAllChatrooms : client가 속해있는 모든 room에 join시킵니다.
 */
export default (io: Namespace, socket: Socket) =>{
    // 해당 사용자를 자신이 속해있는 모든 room에 join시킵니다.
    socket.on("client:joinAllChatrooms", (chatroomIds: number[]) =>{
        chatroomIds.forEach((chatroomId)=>{
            socket.join(chatroomId.toString());
        });
    });
};
