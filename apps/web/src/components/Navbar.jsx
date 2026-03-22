import { NavLink, Route, Routes } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Admin from '../pages/Admin'
import Profile from '../pages/Profile'
import Upload from '../pages/Upload'
import SoundBoard from '../pages/Soundboard'
import Verification from '../pages/Verification'

export default function Navbar({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, handleLogout }) {
    return (
        <div className='app-container'>
                {/* SIDEBAR */}
                <div className='sidebar'>
                    <h4 className='fw-bold mb-5 ps-2'>Immersia</h4>
                    <nav className='d-flex flex-column h-100'>

                        {isLoggedIn ? (
                            /* LOGGED IN VIEW */
                            <>
                                <NavLink to="/soundboard" className="nav-item">
                                    <i className='bi bi-grid-1x2-fill me-3'></i>Soundboard
                                </NavLink>
                                <NavLink to="/profile" className="nav-item">
                                    <i className="bi bi-person me-3"></i>Profile
                                </NavLink>

                                {isAdmin && (
                                    <NavLink to="/admin" className="nav-item">
                                        <i className="bi bi-gear me-3"></i>Admin
                                    </NavLink>
                                )}

                                <NavLink to="/upload" className="nav-item">
                                    <i className="bi bi-cloud-upload me-3"></i>Upload
                                </NavLink>

                                <div className='mt-auto'>
                                    <button
                                        className='btn btn-dark w-100'
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* LOGGED OUT VIEW */
                            <div className='mt-4 border-top pt-4'>
                                <NavLink to="/login" className="nav-item">
                                    <i className='bi bi-box-arrow-in-right me-3'></i>Login
                                </NavLink>
                                <NavLink to="/register" className="nav-item">
                                    <i className="bi bi-person-add me-3"></i>Register
                                </NavLink>
                            </div>
                        )}
                    </nav>
                </div>

                <div className='main-content content-container'>
                    <Routes>
                        {!isLoggedIn ? (
                            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
                        ) : (
                            <Route path="/" element={<SoundBoard />} />
                        )}

                        {/* Auth Routes */}
                        {!isLoggedIn && (
                            <>
                                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
                                <Route path="/register" element={<Register isLoggedIn={isLoggedIn} />} />
                            </>
                        )}

                        {/* Protected Routes */}
                        {isAdmin && <Route path="/admin" element={<Admin />} />}
                        {isLoggedIn && <Route path="/soundboard" element={<SoundBoard />} />}
                        {isLoggedIn && <Route path="/profile" element={<Profile />} />}
                        {isLoggedIn && <Route path='/upload' element={<Upload />} />}
                        <Route path='/verify' element={<Verification />} />
                    </Routes>
                </div>
            </div>
    )
}
