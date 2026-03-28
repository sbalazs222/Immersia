import { toast } from 'react-toastify'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../styles/App.css'

export default function Register() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    async function handleSubmit(event) {
        event.preventDefault()
        const formdata = new FormData(event.target)
        if (!formdata.get('email') || !formdata.get('password') || !formdata.get('confirmPassword')) {
            toast.error('Please fill in all fields')
            return
        }
        if (formdata.get('password') !== formdata.get('confirmPassword')) {
            toast.error('Passwords do not match')
            return
        }

        try {
            const res = await fetch(`https://immersia.techtrove.cc/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formdata.get('email'),
                    password: formdata.get('password')
                })
            })

            if (res.ok) {
                toast.success('Registration successful')
                navigate('/login')
            }
            else {
                try {
                    const result = await res.json()
                    toast.error('Registration failed: ' + (result.message || 'Unknown error'))
                } catch (jsonError) {
                    toast.error('Registration failed with status: ' + res.status)
                }
            }
        } catch (error) {
            toast.error('Network error, please try again later')
        }
    }
    return (
        <>
            <div className='soundboard-dsgn d-flex align-items-center justify-content-center'>
            <div className='soundboard-section p-5' style={{ maxWidth: '450px', flex: 'none' }}>
            <h2 className="mb-4 fw-bold">Register</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3' controlId='formEmail'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' name='email' placeholder='Email' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='formPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e) => setPassword(e.target.value)} type='password' name='password' placeholder='Password' required />
                </Form.Group>
                <Form.Group className='mb-4' controlId='formConfirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' name='confirmPassword' placeholder='Confirm Password' required />
                </Form.Group>
                <p>
                    Password requirements:<br />
                    - Minimum 8 characters {password.length >= 8 ? '✓' : '✗'}<br />
                    - At least one uppercase letter {/[A-Z]/.test(password) ? '✓' : '✗'}<br />
                    - At least one lowercase letter {/[a-z]/.test(password) ? '✓' : '✗'}<br />
                    - At least one number {/[0-9]/.test(password) ? '✓' : '✗'}<br />
                    - At least one special character {/[!@#$%^&*]/.test(password) ? '✓' : '✗'}<br />
                </p>
                <Button type='submit' variant='dark' className='w-100' style={{backgroundColor: '#333333', border: 'none', padding: '10px'}}>Register</Button>
            </Form>
            </div>
            </div>
        </>
    )
}