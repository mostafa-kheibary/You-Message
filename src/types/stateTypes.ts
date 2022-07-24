import { User } from 'firebase/auth';

interface UserState {
  info: User | null;
}

export type { UserState };
