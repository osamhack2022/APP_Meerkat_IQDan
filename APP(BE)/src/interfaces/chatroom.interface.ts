import { Chatroom } from "@prisma/client"

export type ChatroomWithKey = Chatroom & {
  encryptedKey: string
}