import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import store from './store';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || '';
axios.defaults.withCredentials = true;

ReactModal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);