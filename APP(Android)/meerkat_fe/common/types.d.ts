import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { Animated } from "react-native"

export interface ChatRoom {
    chatroomId: number,
    creatorId: number,
    name: string,
    type: string,
    createDate: string,
    updateDate: string
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

export interface UserProfile{
    name: string,
    image?: string | null | undefined,
    statusMessage?: string | null | undefined
    dday?: number
}

export interface GlitterAnimation{
    glitter: Animated.Value,
    glitterStyle: any
}

/**
 * react-navigation related types
 */

export type RootStackParamList = {
    Auth: undefined;
    Main: NavigatorScreenParams<TabParamList>;
    Chat: undefined;
    MyProfile: undefined;
    ChangePw: undefined;
    AddChatRoom: undefined;
};

export type TabParamList = {
    ChatRoomList: undefined;
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