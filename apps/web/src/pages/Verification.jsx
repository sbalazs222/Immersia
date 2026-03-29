import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Button } from "react-bootstrap"

export default function Verification() {
    const [isValidToken, setIsValidToken] = useState(true)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token")

    useEffect(() => {
        if (!token) {
            navigate("/login")
            return
        }

        async function verifyEmail() {
            const res = await fetch(`https://immersia.techtrove.cc/api/mail/verify?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (res.ok) {
                toast.success("Email verified successfully, you can now log in")
                navigate("/login")
            }
            else if (res.status == 400) {
                toast.error("Verification code has expired, click the button below to resend the verification email");
                setIsValidToken(false);
            }
            else {
                toast.error("Failed to verify email");
            }
        }

        verifyEmail()
    }, [token, navigate])

    async function resendVerificationEmail() {
        const res = await fetch(`https://immersia.techtrove.cc/api/mail/resend?token=${token}`, {
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

    return (
        <>
            <h1>Email Verification</h1>
            <p>Your verification code is: {token}</p>
            {isValidToken === false && <Button variant="primary" onClick={resendVerificationEmail}>Resend Verification Email</Button>}
        </>
    )
}