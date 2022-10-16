import prisma from "../db"
/**
 * 크론탭으로 job설정해서 주기적으로 메세지를 삭제해줍니다.
 * 아래 함수는 샘플이며, 현재 돌아가고 있지 않습니다. 즉, 
 * 서버상 삭제는 현재는 데모버전이기에 구동되지 않고 있습니다.
 */
const removeMessageBatch = async () => {
    const chatrooms = await prisma.chatroom.findMany({
        select:{
            chatroomId: true,
            msgExpTime: true,
            removeAfterRead: true,
        }
    })

    // 모두 읽어야 되는지 확인
    const removeFlags = await Promise.all(chatrooms.map((room) => {
        return prisma.usersOnChatrooms.findMany({
            where: {
                chatroomId: room.chatroomId
            },
            select: {
                userId: true,
                recentReadMessageId: true,
            }
        })
    }))

    // 시간 지난 메세지 모두 서버에서 삭제.
    await Promise.all(chatrooms.map((room, idx) => {
        let readId = 1000000000; // max
        if (room.removeAfterRead) {
            const recentReads = removeFlags[idx].map((r) => r.recentReadMessageId)
            readId = Math.max.apply(Math, recentReads)
        }
        const currRoomExpiry = new Date()
        currRoomExpiry.setSeconds(currRoomExpiry.getSeconds() - room.msgExpTime)
        return prisma.message.deleteMany({
            where: {
                belongChatroomId: room.chatroomId,
                sendTime: {
                    lt: currRoomExpiry
                },
                messageId: {
                    lt: readId // 다 읽은 메세지의 최소값. 다 안읽어도 삭제되는 메세지면 그냥 max값이라 다 삭제됨.
                }
            }
        })
    }))
}

removeMessageBatch()