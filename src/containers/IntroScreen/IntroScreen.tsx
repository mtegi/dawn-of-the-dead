import { FC } from 'react';

import * as S from './IntroScreen.styled';

export interface IntroScreenProps {
  title: string;
  buttonLabel: string;
  onButtonClick: () => void;
  transparent?: boolean;
}

const IntroScreen: FC<IntroScreenProps> = ({
  onButtonClick,
  buttonLabel,
  title,
  transparent,
}) => {
  return (
    <S.Wrapper $showBg={!transparent}>
      <S.Title>{title}</S.Title>
      <S.StartButton onClick={onButtonClick}>{buttonLabel}</S.StartButton>
    </S.Wrapper>
  );
};

export default IntroScreen;
