import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"

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
    image?: string | null | undefined,
    event?: UserEvent | null | undefined,
    statusMessage?: string | null | undefined
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