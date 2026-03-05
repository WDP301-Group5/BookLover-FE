import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'admin' | 'author' | 'user';
  status: 'active' | 'inactive' | 'banned';
  avatarURL?: string;
  backgroundURL?: string;
  vipLevel: number;
  nickName?: string;
  penName?: string;
  bio?: string;
}

interface UserState {
  user: UserProfile | null;
  isLoggedIn: boolean;
  setUser: (user: UserProfile | null) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  login: (userData: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (userData: UserProfile) => {
        set({ user: userData, isLoggedIn: true });
      },
      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
        }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: () => {
        localStorage.removeItem('token');
        set(() => ({
          user: null,
          isLoggedIn: false,
        }));
      },
    }),
    {
      name: 'user-store',
    },
  ),
);
