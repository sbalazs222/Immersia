import { useSearchParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "react-bootstrap"

export default async function NewPassword() {
    const [searchParams] = useSearchParams()
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
                newPassword: formdata.get('password')
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (res.ok) {
            toast.success("Password reset successfully, you can now log in")
            navigate("/login");
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
                    <Form.Control type="password" name="password" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm new password</Form.Label>
                    <Form.Control type="password" name="confirmPassword" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Reset password
                </Button>
            </Form>
        </>
    )
}