import { atom } from 'recoil';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    loading: true,
  },
}); 