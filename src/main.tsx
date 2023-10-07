import ReactDOM from 'react-dom/client';

import App from './App.tsx';

import './index.css';
import { PlaycanvasContextProvider } from '@/context/playcanvasContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PlaycanvasContextProvider>
    <App />
  </PlaycanvasContextProvider>
);
