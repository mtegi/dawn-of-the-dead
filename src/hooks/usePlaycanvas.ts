import { useContext } from 'react';

import PlaycanvasContext from '@/context/playcanvasContext';

const usePlaycanvas = () => {
  const ctx = useContext(PlaycanvasContext);
  if (!ctx) {
    throw new Error('Context must be used within Provider');
  }
  return ctx;
};

export default usePlaycanvas;
