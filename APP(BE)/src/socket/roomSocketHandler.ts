import { IMessageDto } from "@/dtos/messages.dto";
import MessageService from "@/services/message.service";
import { Namespace, Socket } from "socket.io"

// room socket event handler
export default (io: Namespace, socket: Socket, messageService: MessageService) =>{
    // room 클릭 시 해당 room에 추가
    socket.on("client:joinChatroom", (roomId: number) =>{
        // TODO  console log는 디버깅용, 추후 완성되면 삭제
        console.log("room room " + roomId + "에 사용자 " + socket.handshake.auth.userId + "접속");
        //
        socket.join(roomId.toString());
    });

    socket.on("client:speakMessage", (iMessageDto: IMessageDto) =>{
        console.log(iMessageDto);
        // TODO : console log는 디버깅용, 추후 완성되면 삭제
        console.log("room " + iMessageDto.belongChatroomId + "에 사용자 " + socket.handshake.auth.userId + "가 메시지 " + iMessageDto.text + "를 보냄, 이상무 사용여부: ", iMessageDto.hasQuickReplies); 
        //////////////

        const userId = socket.handshake.auth.userId
        iMessageDto.senderId = userId;
        messageService.storeMessageAndGetId(iMessageDto)
        .then((messageId) => {
            iMessageDto._id = messageId;
            io.in(iMessageDto.belongChatroomId.toString()).emit("server:hearMessage", iMessageDto);
            io.in(iMessageDto.belongChatroomId.toString()).emit("server:notificateMessage", iMessageDto.text);
        }).catch(Error => {
            // error가 발생해도 터트리지 않고 로깅만 한 후 계속 진행
            console.log(Error);
        })          
    })

    // TODO :// 방에 누군가를 초대해서 새 사람이 들어올 때는, 그 사람이 'OO가 들어왔습니다' 발송하고, 메시지를 서버에 기록으로 남기는게 맞을듯.
};
