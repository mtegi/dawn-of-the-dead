import { FC, useEffect } from 'react';

import bulletUrl from '@/assets/45acp.png';
import * as S from '@/containers/Canvas/Canvas.styled';
import IntroScreen from '@/containers/IntroScreen/IntroScreen';
import { FrontendEvents } from '@/context/playcanvasContext';
import usePlaycanvas from '@/hooks/usePlaycanvas';
import { motionFade } from '@/utils/animations';
import { AnimatePresence, motion } from 'framer-motion';

export interface CanvasProps {}

const Canvas: FC<CanvasProps> = () => {
  const { connect, isReady, loadProgress, ui, sendMessage } = usePlaycanvas();

  useEffect(() => {
    connect();
  }, [connect]);

  const renderWounds = () => {
    const { hp } = ui;
    if (hp <= 90 && hp >= 50) {
      return <S.WoundsLight key="WoundsLight" {...motionFade} />;
    } else if (hp < 50 && hp >= 25) {
      return <S.WoundsMed key="WoundsMed" {...motionFade} />;
    } else if (hp < 25) {
      return <S.WoundsBig key="WoundsBig" {...motionFade} />;
    }
    return null;
  };

  return (
    <S.Wrapper>
      <iframe
        id="pc-iframe"
        src="/playcanvas/index.html"
        frameBorder="0"
        scrolling="none"
      />

      <S.UiWrapper>
        <AnimatePresence>{renderWounds()}</AnimatePresence>

        {ui.hp > 0 && (
          <>
            <S.AmmoBar>
              <AnimatePresence initial={false}>
                {new Array(ui.ammo).fill(null).map((_, index) => (
                  <motion.img
                    key={`bullet-${index}`}
                    src={bulletUrl}
                    alt="45acp"
                    {...motionFade}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </AnimatePresence>
            </S.AmmoBar>

            <S.Crosshair />
          </>
        )}
      </S.UiWrapper>

      {ui.hp <= 0 && (
        <IntroScreen
          title="GAME OVER"
          buttonLabel="RESTART"
          onButtonClick={() => sendMessage(FrontendEvents.RESTART)}
          transparent
        />
      )}

      {!isReady && (
        <S.LoadingScreenWrapper {...motionFade}>
          <S.LoadingText>
            LOADING {(loadProgress * 100).toFixed(0)}%
          </S.LoadingText>
        </S.LoadingScreenWrapper>
      )}
    </S.Wrapper>
  );
};

export default Canvas;
