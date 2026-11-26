import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { ContentProvider } from './hooks/ContentProvider.jsx'
import { AuthProvider } from './hooks/AuthProvider.jsx'
import { reportVitals } from './seo/reportVitals.js'

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.warn('[Magul Sakwala] VITE_GOOGLE_CLIENT_ID is not set — Google Sign-In will not work.')
}

reportVitals()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <ContentProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ContentProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
