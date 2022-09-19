import { DocumentReference, Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

// ** typeSript interfaces ** //

// --- context menu ---
export type ContextMenuItem = { icon?: ReactNode; name: string; function: () => any };
export interface IContextMenu {
    menu: ContextMenuItem[];
    open: boolean;
}

// --- conversations ---
export interface IConversation {
    timeStamp: Timestamp;
    id: string;
    owners: string[];
}
export interface IConversationState {
    conversations: IConversation[];
    currentConversation: { toUser: null | IUser; id: string };
    isOpen: boolean;
}

// --- message ---
export interface IMessage {
    timeStamp: Timestamp;
    id: string;
    owner: string;
    status: 'pending' | 'sent' | 'seen';
    text: string;
    reactions?: string[];
    replyTo?: { id: string; message: string; to: string };
}
export interface IMessageState {
    messages: IMessage[];
    loading: boolean;
}

// --- message input ---
export interface IMessageInput {
    message: string;
    mode: 'create' | 'edit' | 'reply';
    replyTo?: { to: string; message: string; id: string };
    editInfo?: { id: string };
}

// --- toast ---
export interface IToastState {
    message: string;
    status: 'error' | 'success';
    visibility: boolean;
}
// --- user ---
export interface IUser {
    uid: string;
    userName: string;
    name: string;
    bio: string;
    email: string;
    isTyping: boolean;
    avatar: string;
    avatarColor: string;
}
export interface IUserState {
    info: IUser | null;
    status: 'loading' | 'isAuth' | 'isNotAuth';
}

// --- settings ---
export interface ISettings {
    theme: { darkMode: boolean };
}
