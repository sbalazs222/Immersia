import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'

export default function Login({isLoggedIn, setIsLoggedIn}) {
    if (isLoggedIn) {
        return <Navigate to="/" />
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const formdata = new FormData(event.target)
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
        if (res.status === 200) {
            setIsLoggedIn(true)
            toast.success('Login successful')
        }
        else {
            toast.error('Login failed, ' + await res.text())
        }
    }
    return (
        <>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email"/>
                <input type="password" name="password"/>
                <button type="submit">Login</button>
            </form>
        </>
    )
}