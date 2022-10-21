import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { Animated } from "react-native"


export type Chatroom = {
    chatroomId: number
    name: string | null
    type: 'SINGLE' | 'MULTI'
    createDate: Date
    updateDate: Date | null
    /**
     * 30 days till expiration
     */
    msgExpTime: number
    removeAfterRead: boolean
    removeType: "FROMSERVER" | "FROMEARTH"
    numUnreadMessages: number
}

export type ChatroomUnread = {
    chatroomId: number;
    name: string;
    type: 'MULTI' | 'SINGLE'
    createDate: string // 백엔드에는 Date
    updateDate: string // 백엔드에는 Date
    msgExpTime: number;
    removeAfterRead: boolean;
    numUnreadMessages: number;
}

export type ChatroomWithKey = Chatroom & {
    encryptedKey: string
}

export interface Category{
    categoryName: string,
    event?: UserEvent
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
    image: string | null
}

export enum UserEvent{
    NONE,
    RESERVE,
    PROMOTION
}

export interface LoginStatus{
    isNotLoggedIn: string
}

export interface UserProfile{
    name: string,
    image: string | null
    statusMessage?: string | null
    dday?: number
}

export interface AnimatedValue{
    animatedValue: Animated.Value
}

export interface IMessageDto{
    _id : number;
    text: string;
    sendTime: Date;
    deleteTime: Date;
    senderId: number;
    belongChatroomId: number;

    hasQuickReplies: boolean;
}

export interface IMessageSendDto{
    belongChatroomId: number;
    senderId?: number;
  
    text: string;
    deleteTime: Date;
    sendTime: Date;
    // TODO : 사진 들어갈수도. type을 추가해서 처리하면 될듯.

    hasQuickReplies: boolean;
}

// 이상무 
// quick replies
export enum QuickReplyType{
    STATISTICS = 'statistics', // 통계
    REPORT = 'report', // 보고하기 
    CHECK = 'check', // 보고 내용 확인
}

// 보고 시 사용할 type
export enum AllClearResponseType{
    CLEAR = "CLEAR", // 이상 무
    PROBLEM = "PROBLEM", // 특이사항 있음
}

// 이상무 보고 내용
export interface AllClear{
    allClearId: number,
    type: AllClearResponseType,
    content: string,
    user: User
}

/**
 * react-navigation related types
 */

export type RootStackParamList = {
    Auth: undefined;
    Main: NavigatorScreenParams<TabParamList>;
    Chat: {chatroomId: number};
    MyProfile: undefined;
    ChangePw: undefined;
    AddChatroom: undefined;
    Test: undefined;
    AddFriend: undefined;
    UnreadPeoples: {chatroomId: number, messageId: number};
    ReportAllClear: {messageId: number, chatroomId: number};
    AllClearStatisticsTab: {messageId: number, chatroomId: number};
};

export type TabParamList = {
    ChatroomList: undefined;
    Friends: undefined;
    Settings: undefined;
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof TabParamList> = 
    CompositeScreenProps<
        BottomTabScreenProps<TabParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>,
    >;

// 이상무
export type FetchState = {
    isLoading: boolean,
    isFault: boolean,
    isError: boolean,
    list: Array,
    categoryName: string
}

export type AllClearTabParamList = {
    AllClears: Array<AllClearReport>;
    Unreads: Array<User>;
    Problems: Array<AllClearReport>;
}