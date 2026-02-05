import { toast } from 'react-toastify'

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

            if (res.status === 200) {
                const result = await res.json()
                setIsLoggedIn(true)
                if (result.isAdmin) {
                    setIsAdmin(true)
                }
                toast.success('Login successful')
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
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" required />
                <input type="password" name="password" required />
                <button type="submit">Login</button>
            </form>
        </>
    )
}