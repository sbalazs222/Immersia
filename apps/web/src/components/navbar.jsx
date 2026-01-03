import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

import Login from '../pages/Login'

export default function Navbar() {
    return (
        <BrowserRouter>
            <nav>
                <Nav.Link as={NavLink} to="/">Scenes</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            </nav>
            <Routes>
                <Route path="/" element={<h1>Scenes</h1>} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}