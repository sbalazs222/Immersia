import { toast } from 'react-toastify';
import { Form, Button } from 'react-bootstrap';

function Profile() {

    async function handleUpdatePassword(event) {
        event.preventDefault();
        const formdata = new FormData(event.target);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/password`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword: formdata.get('currentPassword'),
                    newPassword: formdata.get('password'),
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setUserData(data);
                toast.success('Password updated successfully');
            } else {
                toast.error('Failed to update password: ' + await res.text());
            }
        } catch (error) {
            toast.error('Failed to update password: ' + error.message);
        }
    }

    return (
        <>
        <div className='soundboard-dsgn d-flex align-items-center justify-content-center'>
            <div className='soundboard-section p-5' style={{ maxWidth: '450px', flex: 'none' }}>
            <h1 className="mb-4 fw-bold">User Data</h1>
            <h3>Change your password by email using the button below.</h3>
            <Form onSubmit={handleUpdatePassword}>
                <Button type="submit" variant='dark' className='w-100' style={{backgroundColor: '#333333', border: 'none', padding: '10px', marginTop: '10px'}}>Send</Button>
            </Form>
            </div>
            </div>
        </>
    );
}
export default Profile;