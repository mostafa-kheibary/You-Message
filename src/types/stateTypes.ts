import { DocumentReference } from 'firebase/firestore';

interface IUser {
  uid: string;
  userName: string;
  bio: string;
  email: string;
  lastSeen: any;
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
interface IMessageChats {
  owner: string;
  text: string;
}
interface IMessage {
  id: string;
  from: DocumentReference;
  to: DocumentReference;
  messages: IMessageChats[];
}
interface IMessageState {
  messages: IMessage[];
  currentChat: IMessage | null;
}
export type { IUserState, IToastState, IUser, IMessageState, IMessage, IMessageChats };
