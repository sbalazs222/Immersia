import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { ToastContainer } from 'react-toastify'
import { useState } from 'react'

import NavbarComponent from './components/Navbar.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      <ToastContainer position="bottom-right" className="p-3" style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }} />
    </>
  )
}

export default App
