import { create } from "zustand";

type NavbarState = {
    isOpen: boolean;
    toggle: () => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
    isOpen: true,
    toggle: () =>
        set((state: { isOpen: boolean }) => ({
            isOpen: !state.isOpen,
        })),
}));
