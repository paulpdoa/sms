import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { CookiesProvider } from 'react-cookie';
import { SnackbarProvider } from 'notistack';


ReactDOM.createRoot(document.getElementById('root')).render(
    <CookiesProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </CookiesProvider>
)
