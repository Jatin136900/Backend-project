import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="750188595668-5n74cf33celldtk5jsvj8mqm29d0c8nf.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>

)
