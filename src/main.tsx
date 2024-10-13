// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
    // StrictMode 주석 해제하면 초기 2번 렌더링
    // <StrictMode>
    <App />
    // </StrictMode>
);
