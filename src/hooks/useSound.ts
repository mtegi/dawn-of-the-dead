import { Howl, HowlOptions } from 'howler';
import { DependencyList, useEffect, useMemo, useRef } from 'react';

import useSoundState from '@/context/SoundState';
import { CommonSound, Media } from '@/types';

const destroy = (howl?: Howl) => {
  if (howl) {
    howl.off(); // Remove event listener
    howl.stop(); // Stop playback
    howl.unload(); // Remove sound from pool
  }
};

interface Options {
  autoplay?: boolean;
  loop?: boolean;
  html5?: false;
  preload?: boolean | 'metadata';
  volume?: number;
}

const defaultOptions: Options = {
  autoplay: false,
  loop: false,
  html5: false,
  preload: true,
};

export const useSound = (
  sound: CommonSound | Media,
  options: Options = defaultOptions,
  deps: DependencyList = []
) => {
  const sounds = useSoundState(s => s.sounds);
  const isMuted = useSoundState(s => s.isMuted);
  const howlerRef = useRef<Howl>();
  const fadeTimeoutRef = useRef<any>(null);

  const source = useMemo(() => {
    let s: string | Media = sound;
    if (typeof sound === 'string') {
      s = sounds[sound];
    }
    return typeof s === 'string'
      ? s
      : (s as Media)?.url
      ? (s as Media).url
      : '';
  }, [sounds, sound]);

  const sourceRef = useRef<string>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoOptions = useMemo<HowlOptions>(
    () => ({ ...defaultOptions, ...options } as HowlOptions),
    deps
  );

  useEffect(() => {
    if (source && source !== sourceRef.current) {
      sourceRef.current = source;

      if (howlerRef.current) {
        destroy(howlerRef.current);
      }

      howlerRef.current = new Howl({
        src: [sourceRef.current as string],
        volume: memoOptions.volume,
        loop: memoOptions.loop,
        autoplay: memoOptions.autoplay,
        html5: memoOptions.html5,
        preload: memoOptions.preload,
        mute: isMuted,
      });
    }

    return () => {
      if (howlerRef.current) {
        destroy(howlerRef.current);
        howlerRef.current = undefined;
      }
      if (fadeTimeoutRef.current) {
        fadeTimeoutRef.current = null;
      }
    };
  }, [source, memoOptions]);

  useEffect(() => {
    const howler = howlerRef.current;
    if (howler) {
      howler.mute(isMuted);
    }
  }, [isMuted]);

  const play = () => {
    if (isMuted) return;
    const howl = howlerRef.current;
    if (howl) {
      const playing = howl.playing();
      if (!playing) {
        howl.volume(memoOptions?.volume || 1);
        if (howl.state() === 'unloaded') {
          howl.load();
          howl.on('load', () => howl.play());
          return;
        }
        howl.play();
      } else {
        howl.stop();
        howl.play();
      }
    }
  };

  const stop = (fade = 0) => {
    const howl = howlerRef.current;
    if (howl) {
      if (fade) {
        const dur = fade * 1000;
        howl.fade(howl.volume(), 0, dur);
        fadeTimeoutRef.current = setTimeout(() => howl.stop(), dur);
      } else {
        howl.stop();
      }
    }
  };

  const pause = (fade = 0) => {
    const howl = howlerRef.current;
    if (howl) {
      if (fade) {
        const dur = fade * 1000;
        howl.fade(howl.volume(), 0, dur);
        fadeTimeoutRef.current = setTimeout(() => howl.pause(), dur);
      } else {
        howl.pause();
      }
    }
  };

  return { play, pause, stop };
};

export default useSound;
