import { create } from 'zustand';

import { CommonSound, Media } from '@/types';

interface SoundState {
  isMuted: boolean;
  toggleMuted: () => void;
  setMuted: (value: boolean) => void;
  sounds: {
    [key: string]: Media | string;
  };
  addSound: (
    ...sounds: Array<{ key: CommonSound; sound: Media | string }>
  ) => void;
}

const useSoundState = create<SoundState>((set, get) => ({
  isMuted: true,
  sounds: {},
  setMuted: value => set({ isMuted: value }),
  addSound: (...sounds) => {
    for (let i = 0; i < sounds.length; i++) {
      const s = sounds[i];
      set({ sounds: { ...get().sounds, [s.key]: s.sound } });
    }
  },
}));

export default useSoundState;
