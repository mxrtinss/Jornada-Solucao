import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import mongoDbService from './services/mongoDbService';

// Initialize MongoDB connection (now just a placeholder)
mongoDbService.connect()
  .then(() => console.log('API service initialized'))
  .catch(err => console.error('Failed to initialize API service:', err));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


