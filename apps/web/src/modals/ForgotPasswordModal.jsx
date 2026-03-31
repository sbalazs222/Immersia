import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
export default function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        if (!email.trim()) {
            toast.error('Please enter your email address')
            return
        }
        setIsSubmitting(true)
        try {
            const res = await fetch(`https://immersia.techtrove.cc/api/mail/pwreset/sendmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })
            if (!res.ok) {
                throw new Error('Failed to send password reset email')
            }
            toast.success('Password reset email sent successfully')
        } catch (error) {
            toast.error('Network error, please try again later')
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <Modal show onHide={onClose} centered ModalclassName='soundboard-section p-2'>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold mb-0">Forgot Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3' controlId='formEmail'>
                        <Form.Label className='mediumtext'>Email</Form.Label>
                        <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type='email' name='email' placeholder='Enter your email' required />
                    </Form.Group>
                    <Button variant='dark' type='submit' disabled={isSubmitting}
                        className="w-100"
                        style={{ backgroundColor: '#333333', border: 'none', padding: '10px', marginTop: '10px' }}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}