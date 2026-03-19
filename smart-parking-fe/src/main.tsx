import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* Bọc AuthProvider ở đây để toàn bộ App lấy được session */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
