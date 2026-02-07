import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-bootstrap'
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom'

import Login from "./Login";
import Register from "./Register";
import SoundBoard from "./Soundboard";
import Admin from "./Admin";
import Profile from "./Profile";

import './styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  function kilepes() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <div className='app-container'>

        {/* BAL MENÜ */}
        <div className='sidebar'>
          <h4 className='fw-bold mb-5 ps-2'>Immersia</h4>
          <nav className='d-flex flex-column h-100'>
            {!isLoggedIn ? (
              <>
                <NavLink to="/Soundboard" className="nav-item"><i className='bi bi-grid-1x2-fill me-3'></i>Soundboard</NavLink>
                <NavLink to="/Profile" className="nav-item"><i className="bi bi-person me-3"></i>Profile</NavLink>
                <NavLink to="/Admin" className="nav-item"><i className="bi bi-gear me-3"></i>Admin</NavLink>
                <div className='mt-auto'>
                  <button className='btn btn-dark w-100' onClick={kilepes}>Logout</button>
                </div>
              </>
            ) : (
              <>
                <div className='mt-4 border-top pt-4'>
                  <NavLink to="/Login" className="nav-item"><i className='bi bi-box-arrow-in-right me-3'></i>Login</NavLink>
                  <NavLink to="/Register" className="nav-item"><i className="bi bi-person-add me-3"></i>Register</NavLink>
                </div>
              </>
            )}
          </nav>
        </div>

        <div className='main-content'>
        <Routes>
          <Route path="/Soundboard" element={<SoundBoard />} />
          <Route path="/Login" element={<Login setLogin={setIsLoggedIn} />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Profile" element={<Profile/>} />
          <Route path="/Admin" element={<Admin/>} />
        </Routes>
        </div>
      </div>
      <ToastContainer position='bottom-end' className='p-3' />
    </BrowserRouter>
  )
}

export default App