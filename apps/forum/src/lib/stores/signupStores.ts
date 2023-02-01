import { create } from "zustand";

interface SignupModalStoreState {
	open: boolean;
	setOpen: (value: boolean) => void;
}

export const useSignupModalStore = create<SignupModalStoreState>((set) => ({
	open: false,
	setOpen: (val) => set(() => ({ open: val })),
}));
