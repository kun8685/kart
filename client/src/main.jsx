import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import axios from 'axios';
import store from './store';
import './index.css'
import App from './App.jsx'

// Set Axios Base URL
// Use VITE_SERVER_URL from env if available (both dev and prod), otherwise default to localhost
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
