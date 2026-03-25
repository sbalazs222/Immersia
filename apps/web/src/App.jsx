import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.css'

import { ToastContainer, toast } from 'react-toastify'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import NavbarComponent from './components/Navbar.jsx'
import { AuthContext, AuthProvider } from './context/AuthContext.jsx'

function AppContent() {
  const { isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, isLoading, lastSession, setLastSession } = useContext(AuthContext)
  const navigate = useNavigate()

  async function handleLogout() {
        try {
            const res = await fetch("https://immersia.techtrove.cc/api/auth/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(
                    {
                    last_session: lastSession
                    }
                )
            });
            if (res.ok) {
                toast.success('Logged out successfully')
                setIsLoggedIn(false)
                setIsAdmin(false)
                setLastSession(null)
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }
            else {
                toast.error('Internal server error, ' + await res.json().message)
            }
        } catch (error) {
            toast.error('Network error, please try again later')
        }
    }

  return (
    <>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      ) : (
        <>
          <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} setIsAdmin={setIsAdmin} handleLogout={handleLogout}/>
          <ToastContainer position="bottom-right" className="p-3" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }} />
        </>
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App