import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './hooks/useAuth'
import './index.css'

// NOTE: Service Worker registration has been removed to prevent
// cached stale authentication states that cause infinite login loops.
// All authentication state is now managed by Supabase's onAuthStateChange
// as the single source of truth.

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                    },
                }}
            />
        </BrowserRouter>
    </React.StrictMode>,
)
