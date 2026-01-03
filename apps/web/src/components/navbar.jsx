import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

export default function Navbar() {
    return (
        <BrowserRouter>
            <nav>
                <Nav.Link as={NavLink} to="/">Scenes</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            </nav>
            <Routes>
                <Route path="/" element={<h1>Scenes</h1>} />
                <Route path="/login" element={<h1>Login Page</h1>} />
            </Routes>
        </BrowserRouter>
    )
}