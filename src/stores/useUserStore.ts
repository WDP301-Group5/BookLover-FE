import { create } from "zustand";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: "admin" | "author" | "user";
  status: "active" | "inactive" | "banned";
  avatarURL?: string;
  backgroundURL?: string;
  vipLevel: number;
  nickName?: string;
  penName?: string;
}

interface UserState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  updateUser: (data: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: !!user,
    })),
  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),
  logout: () =>
    set(() => ({
      user: null,
      isAuthenticated: false,
      isLoggedIn: false,
    })),
  isLoggedIn: true,
  login: (userData: UserProfile) => {
    set({ user: userData, isLoggedIn: true });
  },
}));
