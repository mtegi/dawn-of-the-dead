import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import useSoundState from '@/context/SoundState';

declare let document: any;

export enum PlaycanvasEvents {
  IFrameReady = 'IFrameReady',
  START = 'START',
  LOAD = 'LOAD',
  UI_UPDATE = 'UI_UPDATE',
}

export enum FrontendEvents {
  RESTART = 'restart',
  SET_AUDIO = 'set:audio',
}

type Props = {
  children: React.ReactNode;
};

type UiState = {
  ammo: number;
  hp: number;
};

type PlaycanvasContextTypes = {
  isReady: boolean;
  loadProgress: number;
  connect: () => void;
  sendMessage: (type: FrontendEvents, data?: any) => void;
  ui: UiState;
};

const PlaycanvasContext = createContext<PlaycanvasContextTypes | null>(null);

export const PlaycanvasContextProvider: FC<Props> = ({ children }) => {
  const iframeContent = useRef<Window>(
    document?.getElementById('pc-iframe')?.contentWindow
  );
  const isMuted = useSoundState(s => s.isMuted);
  const messageQueue = useRef<Array<any>>([]);
  const iframeReady = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ui, setUi] = useState<UiState>({ ammo: 8, hp: 100 });

  const onIframeReady = () => {
    iframeReady.current = true;
    console.log('pc iframe ready');
    messageQueue.current.forEach(message => {
      sendMessage(message.type, message.data);
    });
  };

  const onUiUpdate = (data: { state: UiState }) =>
    setUi(prev => ({ ...prev, ...data.state }));

  const onLoad = (data: { loaderProgress: number }) =>
    setLoadProgress(data.loaderProgress);

  const sendMessage = useCallback((type: FrontendEvents, data?: any) => {
    if (!iframeReady.current) {
      messageQueue.current.push({
        type: type,
        data: data,
      });
      return;
    }

    iframeContent.current.postMessage(
      {
        type: type,
        data: data,
      },
      '*'
    );
  }, []);

  const parseMessage = useCallback((event: any) => {
    //console.log('pc event received', event);
    const data = event.data;
    if (!event.data.type) return;

    //event bridge
    switch (event.data.type) {
      case PlaycanvasEvents.IFrameReady:
        onIframeReady();
        break;
      case PlaycanvasEvents.LOAD:
        onLoad(data);
        break;
      case PlaycanvasEvents.START:
        setIsReady(true);
        break;
      case PlaycanvasEvents.UI_UPDATE:
        onUiUpdate(data);
        break;
    }
  }, []);

  const connect = useCallback(() => {
    iframeContent.current = document.getElementById('pc-iframe').contentWindow;
    window.addEventListener('message', parseMessage);
    console.log('pc iframe connected');
  }, [parseMessage]);

  useEffect(() => {
    sendMessage(FrontendEvents.SET_AUDIO, isMuted);
  }, [isMuted]);

  useEffect(() => {
    return window.removeEventListener('message', parseMessage);
  }, [parseMessage]);

  return (
    <PlaycanvasContext.Provider
      value={{
        connect,
        sendMessage,
        isReady,
        loadProgress,
        ui,
      }}
    >
      {children}
    </PlaycanvasContext.Provider>
  );
};

export default PlaycanvasContext;
