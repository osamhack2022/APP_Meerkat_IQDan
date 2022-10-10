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
    image: string
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
    image?: string | null | undefined,
    statusMessage?: string | null | undefined
    dday?: number
}

export interface AnimatedValue{
    animatedValue: Animated.Value
}

export interface MessageDto {
    userId: number;
    content: string;
    // TODO : 사진 들어갈수도. type을 추가해서 처리하면 될듯.
    roomId: number;
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