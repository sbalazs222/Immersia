import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Nav, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Login from '../pages/Login'
import Register from '../pages/Register'

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {

    async function handleLogout() {
        const res = await fetch(`/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (res.ok) {
            toast.success('Logged out successfully')
            setIsLoggedIn(false)
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
                <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/register" element={<Register isLoggedIn={isLoggedIn} />} />
            </Routes>
        </BrowserRouter>
    )
}