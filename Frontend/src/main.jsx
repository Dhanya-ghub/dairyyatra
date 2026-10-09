import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const AdminPortal = lazy(() => import('./components/admin/AdminPortal'))
const isAdminRoute = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={null}>
        <AdminPortal />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)