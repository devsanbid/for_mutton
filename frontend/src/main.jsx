import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';

// checking design


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
