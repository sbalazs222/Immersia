import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { Form, Button } from 'react-bootstrap';

function Profile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);
    
    async function fetchUserData() {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`, {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUserData(data);
                toast.success('User data fetched successfully');
            } else {
                toast.error('Failed to fetch user data: ' + await res.text());
            }
        } catch (error) {
            toast.error('Failed to fetch user data: ' + error.message);
        }
    }

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
            <h1>User Profile</h1>
            {userData && (
                <div>
                    <p>Email: {userData.email}</p>
                </div>
            )}
            <Form onSubmit={handleUpdatePassword}>
                <Form.Group controlId="formCurrentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" name="currentPassword" placeholder="Current Password" />
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="New Password" />
                </Form.Group>
                <Button type="submit">Update Password</Button>
            </Form>
        </>
    );
}
export default Profile;