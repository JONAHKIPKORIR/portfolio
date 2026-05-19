import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Check for saved dark mode
const isDark = localStorage.getItem('darkMode') === 'true' ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('darkMode'));

if (isDark) {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)