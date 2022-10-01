
export interface ChatRoom {
    chatroomId: number,
    creatorId: number,
    name: string,
    type: string,
    createDate: string,
    updateDate: string
}

export interface User{
    userId: number,
    uid: string,
    password: string,
    name: string,
    serviceNumber: string,
    enlistmentDate: DateTime,
    affiliatedUnit: string,
    militaryRank: string,
    image: string
}
