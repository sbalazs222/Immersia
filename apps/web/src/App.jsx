import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/App.css'

import { ToastContainer, toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import NavbarComponent from './components/Navbar.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                toast.success('Logged out successfully')
                setIsLoggedIn(false)
                setIsAdmin(false)
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
      <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} setIsAdmin={setIsAdmin} handleLogout={handleLogout}/>

      <ToastContainer position="bottom-right" className="p-3" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }} />
    </>
  )
}

export default App