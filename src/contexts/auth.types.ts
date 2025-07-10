import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
