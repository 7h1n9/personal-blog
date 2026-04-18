import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';   // ① 导入路由
import { HelmetProvider } from 'react-helmet-async'; // ② 导入Helmet提供者
import App from './App';
import './index.css';

const routerBase = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>        {/* ③ 包裹HelmetProvider */}
      <BrowserRouter basename={routerBase}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
