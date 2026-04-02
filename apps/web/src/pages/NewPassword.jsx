import { useSearchParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button, Form, InputGroup } from "react-bootstrap"
import { useState } from "react"

export default function NewPassword() {
    const [searchParams] = useSearchParams()
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
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
        <div className="soundboard-dsgn d-flex align-items-center justify-content-center">
            <div className="soundboard-section p-5" style={{maxWidth: '450px', flex: 'none', width: '100%'}}>
            <h2 className="mb-4 fw-bold text-center">Password reset</h2>
            <Form onSubmit={resetPassword}>
                <Form.Group className="mb-3">
                    <Form.Label className="mediumtext">New password</Form.Label>
                    <InputGroup>
                    <Form.Control type={showPassword ? 'text' : 'password'} name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)} style={{ borderColor: '#ddd', display: 'flex', alignItems: 'center' }}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </Button>
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label className="mediumtext">Confirm new password</Form.Label>
                    <Form.Control type={showPassword ? 'text' : 'password'} name="confirmPassword" />
                </Form.Group>
                <Button variant="dark" type="submit" className="w-100 fw-bold"
                style={{backgroundColor: '#333333', border: 'none', padding: '10px'}}>
                    Reset password
                </Button>
                {
                            password.length > 0 &&
                                <div className="smalltext mt-4" style={{lineHeight: '1.6'}}>
                                <strong>Password requirements:</strong><br />
                                - Minimum 8 characters {password.length >= 8 ? '✓' : '✗'}<br />
                                - At least one uppercase letter {/[A-Z]/.test(password) ? '✓' : '✗'}<br />
                                - At least one lowercase letter {/[a-z]/.test(password) ? '✓' : '✗'}<br />
                                - At least one number {/[0-9]/.test(password) ? '✓' : '✗'}<br />
                                - At least one special character {/[!@#$%^&*]/.test(password) ? '✓' : '✗'}<br />
                            </div>
                        }
            </Form>
            </div>
            </div>
        </>
    )
}