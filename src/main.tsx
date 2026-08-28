import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { OrganizationProvider } from './contexts/OrganizationContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrganizationProvider>
      <App />
    </OrganizationProvider>
  </StrictMode>,
)
