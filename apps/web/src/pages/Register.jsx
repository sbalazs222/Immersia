import { toast } from 'react-toastify'
export default function Register() {
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formdata.get('email'),
                password: formdata.get('password')
            })
        })
        if (res.status === 200) {
            toast.success('Registration successful')
        }
    }
    return (
        <>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email"/>
                <input type="password" name="password"/>
                <input type="password" name="confirmPassword" />
                <button type="submit">Register</button>
            </form>
        </>
    )
}