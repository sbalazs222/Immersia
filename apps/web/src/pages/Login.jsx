import { toast } from 'react-toastify'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import ForgotPasswordModal from '../modals/ForgotPasswordModal'
import '../styles/App.css'


export default function Login() {
    const { login, setIsLoggedIn, setIsAdmin } = useContext(AuthContext)
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    const navigate = useNavigate()
    async function handleSubmit(event) {
        event.preventDefault()

        const formdata = new FormData(event.target)
        if (!formdata.get('email') || !formdata.get('password')) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            const result = await login(formdata.get('email'), formdata.get('password'))

            if (result.ok) {
                toast.success('Login successful')
                navigate('/soundboard')
            }
            else if (result.data?.message === 'ACCOUNT_NOT_VERIFIED') {
                toast.error('Email not verified, please check your inbox for the verification email');
            }
            else {
                toast.error('Login failed: ' + (result.data?.message || `HTTP ${result.status}`))
            }
        } catch (error) {
            toast.error('Network error, please try again later')
        }
    }
    return (
        <>
            <div className='soundboard-dsgn d-flex align-items-center justify-content-center'>
                <div className='soundboard-section p-5' style={{ maxWidth: '450px', flex: 'none' }}>
                    <h2 className="mb-4 fw-bold">Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mb-3' controlId='formEmail'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' name='email' placeholder='Email' required />
                        </Form.Group>
                        <Form.Group className='mb-4' controlId='formPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name='password' placeholder='Password' required />
                        </Form.Group>
                        <Button type='submit' variant='secondary' className='w-100 mb-3' style={{ backgroundColor: '#333333', border: 'none', padding: '10px' }}>Login</Button>
                        <Button variant='link' className='w-100 text-decoration-none mt-2' style={{ color: '#555555', fontSize: '14px', fontWeight: '500' }} type='button' onClick={() => setShowForgotPassword(true)}>Forgot Password?</Button>
                    </Form>
                </div>
            </div>
            {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
            {/* For testing purposes, remove this in production */}
            {import.meta.env.DEV == true ? <Button onClick={() => { setIsLoggedIn(true); setIsAdmin(true); }}>Login as Admin (for testing)</Button> : null}
        </>
    )
}