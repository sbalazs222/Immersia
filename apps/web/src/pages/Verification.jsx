import { useSearchParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "react-bootstrap"

export default async function Verification() {
    const [isValidToken, setIsValidToken] = useState(true)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const code = searchParams.get("code")
    if (!code) {
        navigate("/login")
        return null
    }

    async function verifyEmail() {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify?code=${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (res.ok) {
            toast.success("Email verified successfully, you can now log in")
            setTimeout(() => {}, 3000);
            navigate("/login");
        }
        else if (res.status === 410) {
            toast.error("Verification code has expired");
            setIsValidToken(false);
        }
        else {
            toast.error("Failed to verify email");
            navigate("/login");
        }
    }

    async function resendVerificationEmail() {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend?code=${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (res.ok) {
            toast.success("Verification email resent, please check your inbox")
        }
        else {
            toast.error("Failed to resend verification email")
        }
    }

    verifyEmail()

    return (
        <>
            <h1>Email Verification</h1>
            <p>Your verification code is: {code}</p>
            {isValidToken === false && <Button variant="primary" onClick={resendVerificationEmail}>Resend Verification Email</Button>}
        </>
    )
}