import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { ToastContainer } from 'react-bootstrap'
import { useState } from 'react'

import NavbarComponent from './components/Navbar.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <ToastContainer position="bottom-end" className="p-3" />
    </>
  )
}

export default App
