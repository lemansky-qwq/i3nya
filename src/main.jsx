import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './style.css';

import { AuthProvider } from './lib/AuthProvider'; // ← 引入用户状态管理器

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
