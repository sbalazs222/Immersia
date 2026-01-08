import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

import Login from '../pages/Login'
import Register from '../pages/Register'

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
    return (
        <BrowserRouter>
            <nav>
                {
                    isLoggedIn ? 
                    (
                        <Nav.Link as={NavLink} to="/">Scenes</Nav.Link>
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