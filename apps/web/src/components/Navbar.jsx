import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Admin from '../pages/Admin'
import Profile from '../pages/Profile'
import Upload from '../pages/Upload'
import SoundBoard from '../pages/Soundboard'
import Verification from '../pages/Verification'

export default function Navbar({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, handleLogout }) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className='app-container'>
            {/* SIDEBAR */}
            <div className={isOpen ? 'sidebar' : 'sidebar sidebar-closed'}>
                <div className='d-flex align-items-center'>
                    <button className='btn btn-light border-0 d-flex justify-content-center align-items-center'
                        style={{ width: '40px', height: '40px', flexShrink: 0 }} onClick={() => setIsOpen(!isOpen)}>
                        <i className='bi bi-list fs-4 text-secondary'></i>
                    </button>
                    {isOpen && <h4 className='fw-bold mb-0 ms-2'>Immersia</h4>}
                </div>

                <hr className="text-muted mt-4 mb-4" style={{ opacity: 0.15 }} />

                <nav className='d-flex flex-column h-100'>
                    {isLoggedIn ? (
                        /* LOGGED IN VIEW */
                        <>
                            <NavLink to="/soundboard" className="nav-item">
                                <i className='bi bi-grid-1x2-fill'></i>
                                <span className='ms-3'>Soundboard</span>
                            </NavLink>

                            <NavLink to="/profile" className="nav-item">
                                <i className="bi bi-person fs-5"></i>
                                <span className='ms-3'>Profile</span>
                            </NavLink>

                            {isAdmin && (
                                <NavLink to="/admin" className="nav-item">
                                    <i className="bi bi-gear fs-5"></i>
                                    <span className='ms-3'>Admin</span>
                                </NavLink>
                            )}

                            <NavLink to="/upload" className="nav-item">
                                <i className="bi bi-cloud-upload fs-5"></i>
                                <span className='ms-3'>Upload</span>
                            </NavLink>

                            <div className='mt-auto'>
                                <button
                                    className='btn btn-dark w-100 d-flex align-items-center logout-btn'
                                    onClick={handleLogout}
                                >
                                    <i className='bi bi-box-arrow-left'></i>
                                    <span className='ms-2'>Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        /* LOGGED OUT VIEW */
                        <div className='d-flex flex-column'>
                            <NavLink to="/login" className="nav-item">
                                <i className='bi bi-box-arrow-in-right fs-5'></i>
                                <span className='ms-3'>Login</span>
                            </NavLink>
                            <NavLink to="/register" className="nav-item">
                                <i className="bi bi-person-add fs-5"></i>
                                <span className='ms-3'>Register</span>
                            </NavLink>
                        </div>
                    )}
                </nav>
            </div>

                <div className='main-content content-container'>
                    <Routes>
                        {!isLoggedIn ? (
                            <Route path="/" element={<Login />} />
                        ) : (
                            <Route path="/" element={<SoundBoard />} />
                        )}

                        {/* Auth Routes */}
                        {!isLoggedIn && (
                            <>
                                <Route path="/login" element={<Login />} />
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
