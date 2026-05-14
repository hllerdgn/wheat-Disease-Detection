import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SimpleApp from './app/SimpleApp.tsx'
import { Toaster } from 'sonner'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleApp />
    <Toaster position="top-right" richColors />
  </StrictMode>,
)
