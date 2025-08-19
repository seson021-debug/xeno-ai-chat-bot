import { createContext } from 'react';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});
