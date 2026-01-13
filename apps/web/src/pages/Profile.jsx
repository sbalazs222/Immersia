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

    return (
        <>
            <h1>User Profile</h1>
            {userData && (
                <div>
                    <p>Email: {userData.email}</p>
                </div>
            )}
        </>
    );
}
export default Profile;