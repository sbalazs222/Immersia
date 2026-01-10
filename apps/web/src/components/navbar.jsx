import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Nav, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Admin from '../pages/Admin'

export default function Navbar({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }) {

    async function handleLogout() {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (res.ok) {
            toast.success('Logged out successfully')
            setIsLoggedIn(false)
            setIsAdmin(false)
        }
        else {
            toast.error('Internal server error, ' + await res.json().message)
        }
    }

    return (
        <BrowserRouter>
            <nav>
                {
                    isLoggedIn ? 
                    (
                        <>
                            <Nav.Link as={NavLink} to="/">Scenes</Nav.Link>
                            <Button onClick={handleLogout}>Logout</Button>
                        </>
                    )
                    :
                    (
                        <>
                            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                            <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                        </>
                    )
                }
            </nav>
            <Routes>
                <Route path="/" element={<h1>Scenes</h1>} />
                {!isAdmin && <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />}
                <Route path="/register" element={<Register isLoggedIn={isLoggedIn} />} />
                {isAdmin && <Route path="/admin" element={<Admin />} />}
            </Routes>
        </BrowserRouter>
    )
}