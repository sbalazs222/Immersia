import { useSearchParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Form } from "react-bootstrap"
import { useState } from "react"

export default function NewPassword() {
    const [searchParams] = useSearchParams()
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const token = searchParams.get("token")
    if (!token) {
        navigate("/login")
        return null
    }

    async function resetPassword(e) {
        e.preventDefault();
        const formdata = new FormData(e.target);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mail/pwreset?token=${token}`, {
            method: 'POST',
            body: JSON.stringify({
                password: formdata.get('password')
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (res.ok) {
            toast.success("Password reset successfully")
        }
        else  {
            toast.error("Failed to reset password");
        }
    }

    return (
        <>
            <h1>Password reset</h1>
            <Form onSubmit={resetPassword}>
                <Form.Group>
                    <Form.Label>New password</Form.Label>
                    <Form.Control type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm new password</Form.Label>
                    <Form.Control type="password" name="confirmPassword" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Reset password
                </Button>
                {
                            password.length > 0 && <p>
                                Password requirements:<br />
                                - Minimum 8 characters {password.length >= 8 ? '✓' : '✗'}<br />
                                - At least one uppercase letter {/[A-Z]/.test(password) ? '✓' : '✗'}<br />
                                - At least one lowercase letter {/[a-z]/.test(password) ? '✓' : '✗'}<br />
                                - At least one number {/[0-9]/.test(password) ? '✓' : '✗'}<br />
                                - At least one special character {/[!@#$%^&*]/.test(password) ? '✓' : '✗'}<br />
                            </p>
                        }
            </Form>
        </>
    )
}