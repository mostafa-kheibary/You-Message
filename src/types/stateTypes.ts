interface IUser {
  uid: string;
  userName: string;
  bio: string;
  email: string;
  lastSeen: string;
  contact: string[];
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
export type { IUserState, IToastState, IUser };
