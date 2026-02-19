import { toast } from 'react-toastify'
import { Form, Button } from 'react-bootstrap'

export default function Login({setIsLoggedIn, setIsAdmin}) {
    async function handleSubmit(event) {
        event.preventDefault()

        const formdata = new FormData(event.target)
        if (!formdata.get('email') || !formdata.get('password')) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formdata.get('email'),
                    password: formdata.get('password')
                })
            })

            if (res.ok) {
                const result = await res.json()
                setIsLoggedIn(true)
                if (result.isAdmin) {
                    setIsAdmin(true)
                }
                toast.success('Login successful')
            }
            else if (res.message == 'ACCOUNT_NOT_VERIFIED') {
                toast.error('Email not verified, please check your inbox for the verification email');
            }
            else {
                try {
                    const result = await res.json()
                    toast.error('Login failed: ' + (result.message || 'Unknown error'))
                } catch (jsonError) {
                    toast.error('Login failed with status: ' + res.status)
                }
            }
        } catch (error) {
            toast.error('Network error, please try again later')
        }
    }
    return (
        <>
            <h1>Login Page</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='formEmail'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' name='email' required/>
                </Form.Group>
                <Form.Group controlId='formPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' name='password' required/>
                </Form.Group>
                <Button type='submit'>Login</Button>
            </Form>

            {/* For testing purposes, remove this in production */}
            {import.meta.env.DEV == true ? <Button onClick={() => {setIsLoggedIn(true); setIsAdmin(true);}}>Login as Admin (for testing)</Button> : null}
            
        </>
    )
}