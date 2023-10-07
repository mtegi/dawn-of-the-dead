import styled from 'styled-components';

import { ReactComponent as SvgCrosshair } from '@/assets/Crosshair.svg';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  > iframe {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border: none;
  }
`;

export const LoadingScreenWrapper = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: black;

  z-index: 1;
`;

export const LoadingText = styled.div`
  font-size: 2vw;
  color: white;
`;

export const UiWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  user-select: none;
`;

export const AmmoBar = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 2rem;
  display: flex;

  > img {
    width: 2rem;
    height: auto;
  }
`;

export const WoundsBig = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(2, 0, 36, 0) 0%,
    rgba(255, 0, 14, 0.5998774509803921) 100%
  );
`;

export const WoundsMed = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(2, 0, 36, 0) 0%,
    rgba(255, 0, 14, 0.6) 200%
  );
`;

export const WoundsLight = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(2, 0, 36, 0) 50%,
    rgba(255, 0, 14, 0.6) 200%
  );
`;

export const Crosshair = styled(SvgCrosshair)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2rem;
  transform: translate(-50%, -50%);
`;
