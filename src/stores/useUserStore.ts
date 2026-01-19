import { create } from "zustand";

export interface UserProfile {
  avatar: string | null;
  username?: string;
  name?: string;
  accountType?: "google" | "email";
  level?: "vip1" | "vip2" | "vip3";
}

interface UserState {
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    avatar: null,
    username: "nga123",
    name: "Nguyen Thien Nga",
    accountType: "google",
    level: "vip2",
  },
  updateUser: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
    })),
}));
