import { create } from "zustand";

type Sound = { sound: boolean; setSound: (sound: boolean) => void };

export const UseSound = create<Sound>((set) => ({
  sound: true,
  setSound: (sound: boolean) => set({ sound }),
}));
