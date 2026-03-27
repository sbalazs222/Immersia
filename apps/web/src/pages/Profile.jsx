import { toast } from 'react-toastify';
import { Form, Button } from 'react-bootstrap';

function Profile() {

    async function resetPassword(e) {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mail/pwreset/sendmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (res.ok) {
            toast.success("Password reset email sent. Please check your inbox.")
        }
        else  {
            toast.error("Failed to send password reset email");
        }
    }

    return (
        <>
        <div className='soundboard-dsgn d-flex align-items-center justify-content-center'>
            <div className='soundboard-section p-5' style={{ maxWidth: '450px', flex: 'none' }}>
            <h1 className="mb-4 fw-bold">User Data</h1>
            <h3>Change your password by email using the button below.</h3>
            <Form onSubmit={resetPassword}>
                <Button type="submit" variant='dark' className='w-100' style={{backgroundColor: '#333333', border: 'none', padding: '10px', marginTop: '10px'}}>Send Reset Email</Button>
            </Form>
            </div>
            </div>
        </>
    );
}
export default Profile;