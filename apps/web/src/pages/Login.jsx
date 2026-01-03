export default function Login() {
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
            document.getElementById('resMessage').style.color = 'green'
            document.getElementById('resMessage').innerText = 'Login successful'
        }
        else {
            document.getElementById('resMessage').style.color = 'red'
            document.getElementById('resMessage').innerText = 'Login failed'
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
            <p id="resMessage"></p>
        </>
    )
}