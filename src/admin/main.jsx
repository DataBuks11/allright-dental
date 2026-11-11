import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './App';
import { BrowserRouter } from 'react-router-dom';

// ✅ Import all global CSS for admin panel here
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./App.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
<ToastContainer position="top-right" autoClose={3000} />
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminApp />
    </BrowserRouter>
  </React.StrictMode>
);
