import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
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
            <form onSubmit={handleUpdatePassword}>
                <input type="password" name="currentPassword" placeholder="Current Password" />
                <input type="password" name="password" placeholder="New Password" />
                <button type="submit">Update Password</button>
            </form>
        </>
    );
}
export default Profile;