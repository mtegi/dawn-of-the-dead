import { FC } from 'react';

import * as S from './Layout.styled';

import { ReactComponent as SoundOff } from '@/assets/SoundOff.svg';
import { ReactComponent as SoundOn } from '@/assets/SoundOn.svg';
import useSoundState from '@/context/SoundState';

export interface Layout {}

const Layout: FC<Layout> = () => {
  const isMuted = useSoundState(s => s.isMuted);
  const setMuted = useSoundState(s => s.setMuted);

  return (
    <>
      <S.SoundButton onClick={() => setMuted(!isMuted)}>
        {isMuted ? <SoundOff /> : <SoundOn />}
      </S.SoundButton>
    </>
  );
};

export default Layout;
