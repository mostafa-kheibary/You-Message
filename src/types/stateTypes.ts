import { User } from 'firebase/auth';

interface IUserState {
  info: User | null;
}
interface IToastState {
  message: string;
  status: 'error' | 'success';
  visibility: boolean;
}
export type { IUserState, IToastState };
