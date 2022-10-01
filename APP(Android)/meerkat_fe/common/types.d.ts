
export interface ChatRoom {
    chatroomId: number,
    creatorId: number,
    name: string,
    type: string,
    createDate: string,
    updateDate: string
}

export interface Category{
    categoryName: string
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

export enum UserEvent{
    NONE,
    RESERVE,
    PROMOTION
}

export interface UserProfile{
    name: string,
    image: string | null,
    event: UserEvent | null,
    statusMessage: string | null
}