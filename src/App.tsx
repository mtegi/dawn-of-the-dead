import { useEffect, useState } from 'react';

import './App.css';
import './utils/styles/fontFace.css';
import BgMusic from '@/assets/sounds/BlackRose.mp3';
import Canvas from '@/containers/Canvas/Canvas';
import IntroScreen from '@/containers/IntroScreen/IntroScreen';
import Layout from '@/containers/Layout/Layout';
import useSoundState from '@/context/SoundState';
import useSound from '@/hooks/useSound';
import { CommonSound } from '@/types';

type ScreenType = 'intro' | 'game';

function App() {
  const [screen, setScreen] = useState<ScreenType>('intro');

  const isMuted = useSoundState(s => s.isMuted);
  const setMuted = useSoundState(s => s.setMuted);
  const addSound = useSoundState(s => s.addSound);

  useEffect(() => {
    addSound({
      key: CommonSound.BackgroundMusic,
      sound: BgMusic,
    });
  }, []);

  const bgSound = useSound(CommonSound.BackgroundMusic, {
    volume: 0.05,
    loop: true,
  });

  useEffect(() => {
    setMuted(true);
  }, [setMuted]);

  useEffect(() => {
    if (!isMuted) {
      bgSound.play();
    } else {
      bgSound.pause();
    }
  }, [isMuted]);

  const onStartGame = () => {
    setMuted(false);
    setScreen('game');
  };

  const renderContent = () => {
    switch (screen) {
      case 'intro':
        return (
          <IntroScreen
            onButtonClick={onStartGame}
            buttonLabel="START GAME"
            title="DAWN OF THE DEAD"
          />
        );
      case 'game':
        return <Canvas />;
    }
  };

  return (
    <>
      {renderContent()}
      <Layout />
    </>
  );
}

export default App;
