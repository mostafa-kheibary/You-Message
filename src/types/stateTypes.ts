import { DocumentReference, Timestamp } from 'firebase/firestore';

interface IUser {
  uid: string;
  userName: string;
  bio: string;
  email: string;
  lastSeen: Timestamp;
  isTyping: boolean;
  isOnline: boolean;
  avatar: string;
}
interface IUserState {
  info: IUser | null;
  status: 'loading' | 'isAuth' | 'isNotAuth';
}
interface IToastState {
  message: string;
  status: 'error' | 'success';
  visibility: boolean;
}
interface IMessageChat {
  owner: string;
  text: string;
}
interface IMessage {
  id: string;
  owners: DocumentReference[];
  messages: IMessageChat[];
}
interface IMessageState {
  messages: IMessage[];
  currentChat: {
    to: IUser | null;
    chats: IMessageChat[];
  };
}
export type { IUserState, IToastState, IUser, IMessageState, IMessage, IMessageChat };
