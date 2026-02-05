import { NavLink, Route, Routes, BrowserRouter } from 'react-router-dom'
import { Navbar as BSNavbar, Container, Nav, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Admin from '../pages/Admin'
import Profile from '../pages/Profile'
import Upload from '../pages/Upload'

export default function Navbar({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }) {

    async function handleLogout() {
        try {
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
        } catch (error) {
            toast.error('Network error, please try again later')
        }
    }

    return (
        <BrowserRouter>
            
            <BSNavbar bg="dark" variant="dark" expand="lg" sticky="top">
                <Container fluid>
                    <BSNavbar.Brand as={NavLink} to="/">Immersia</BSNavbar.Brand>
                    <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BSNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {
                                isLoggedIn ? 
                                (
                                    <>
                                        <Nav.Link as={NavLink} to="/">Scenes</Nav.Link>
                                        <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                                        {isAdmin && <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>}
                                        <Nav.Link as={NavLink} to="/upload">Upload</Nav.Link>
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
                        </Nav>
                        {isLoggedIn && (
                            <Nav>
                                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                            </Nav>
                        )}
                    </BSNavbar.Collapse>
                </Container>
            </BSNavbar>
            <div className="content-container">
                <Routes>
                    <Route path="/" element={<h1>Scenes</h1>} />
                    {!isLoggedIn && <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />}
                    <Route path="/register" element={<Register isLoggedIn={isLoggedIn} />} />
                    {isAdmin && <Route path="/admin" element={<Admin />} />}
                    {isLoggedIn && <Route path="/profile" element={<Profile />} />}
                    <Route path='/upload' element={<Upload />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}