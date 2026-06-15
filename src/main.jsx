import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import Legal from './components/Legal.jsx'
import './styles.css'
import './admin.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/legal/:page" element={<Legal />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
