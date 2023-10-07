import styled, { css } from 'styled-components';

import bgUrl from '@/assets/bg.jpg';
import { breakpointTablet } from '@/utils/styles/responsive';

export const Wrapper = styled.div<{ $showBg: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ $showBg }) =>
    $showBg &&
    css`
      background: linear-gradient(
          180deg,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0.6) 80%,
          rgba(0, 0, 0, 0.43601190476190477) 100%
        ),
        url(${bgUrl});
    `}
`;

export const StartButton = styled.button`
  position: absolute;
  bottom: 20%;

  width: 10rem;
  height: 3rem;
  background-color: #fff;
  color: black;

  @media (min-width: ${breakpointTablet}px) and (min-height: 600px) {
    width: 20rem;
    height: 5rem;
    font-size: 1.5rem;
    bottom: 30%;
  }

  &:hover {
    background-color: #d0d0d0;
  }
`;

export const Title = styled.h1`
  font-size: 3rem;

  @media (min-width: ${breakpointTablet}px) and (min-height: 600px) {
    font-size: 5rem;
  }

  position: absolute;
  top: 10%;
`;
