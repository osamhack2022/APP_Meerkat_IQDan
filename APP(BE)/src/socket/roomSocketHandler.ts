import { IMessageDto } from "@/dtos/messages.dto";
import AllClearSerivce from "@/services/allclear.service";
import MessageService from "@/services/message.service";
import { Namespace, Socket } from "socket.io"

/**
 * room socket event handler
 * 실시간 채팅 기능을 구현하기 위한 socket event handler입니다.
 * @on client:joinChatroom : client가 room에 join하고 싶다는 event를 처리합니다.
 * @on client:speakMessage : client가 채팅을 보냈을 때 event를 처리합니다. server:hearMessage와 server:notificateMessage를 emit합니다.
 * @emit server:hearMessage : 서버가 메시지를 수신했으며, 해당 room에 메시지가 전송되었다는 것을 알립니다.
 * @emit server:notificateMessage : 서버가 해당 room에 메시지가 전송되었다는 것을 알립니다.
 */
export default (io: Namespace, socket: Socket, messageService: MessageService, allClearService: AllClearSerivce) =>{
    // 현 사용자를 roomId에 해당하는 room에 추가합니다.
    socket.on("client:joinChatroom", (roomId: number) =>{
        ////////// DEBUG : debug용 console log ////////
        console.log("room room " + roomId + "에 사용자 " + socket.handshake.auth.userId + "접속");
        ///////////////////////////////////////////////
        socket.join(roomId.toString());
    });

    // 현 사용자가 전송한 message를 DB에 저장 후 해당 room에 뿌립니다.
    socket.on("client:speakMessage", (iMessageDto: IMessageDto) =>{
        ////////// DEBUG : debug용 console log ////////
        console.log(iMessageDto);
        console.log("room " + iMessageDto.belongChatroomId + "에 사용자 " + socket.handshake.auth.userId + "가 메시지 " + iMessageDto.text + "를 보냄, 이상무 사용여부: ", iMessageDto.hasQuickReplies); 
        ///////////////////////////////////////////////

        const userId = socket.handshake.auth.userId;
        iMessageDto.senderId = userId;
        
        // message를 DB에 저장합니다.
        messageService.storeMessageAndGetId(iMessageDto)
        .then((messageId) => {
            iMessageDto._id = messageId;
            if(iMessageDto.hasQuickReplies){
                allClearService.createAllClear(userId, messageId);
            }

            // 해당 room에 속해있는 모든 client에게 뿌립니다.
            io.in(iMessageDto.belongChatroomId.toString()).emit("server:hearMessage", iMessageDto);
            io.in(iMessageDto.belongChatroomId.toString()).emit("server:notificateMessage", iMessageDto.text);
        }).catch(Error => {
            // error가 발생해도 터트리지 않고 로깅만 한 후 계속 진행합니다.
            console.log(Error);
        })          
    })
};
