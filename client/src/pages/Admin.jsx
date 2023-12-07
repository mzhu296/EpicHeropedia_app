import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
    const [userEmail, setUserEmail] = useState('');
    const [reviewId, setReviewId] = useState('');
    const [hidden, setHidden] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRoleChange = async () => {
        try {
            const response = await axios.put('/api/admin/grant-site-manager', { userEmail });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred');
            setMessage('');
        }
    };

    const handleReviewVisibility = async () => {
        try {
            const response = await axios.put('/api/admin/mark-review', { reviewId, hidden });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred');
            setMessage('');
        }
    };

    const handleUserStatus = async () => {
        try {
            const response = await axios.put('/api/admin/toggle-user', { userEmail, isDisabled });
            setMessage(response.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred');
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Admin</h2>
            {message && <div style={{ color: 'green' }}>{message}</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <div>
                <h3>Grant Site Manager Role</h3>
                <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="User Email" />
                <button onClick={handleRoleChange}>Grant Role</button>
            </div>

            <div>
                <h3>Update Review Visibility</h3>
                <input type="text" value={reviewId} onChange={(e) => setReviewId(e.target.value)} placeholder="Review ID" />
                <label>
                    <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
                    Hide Review
                </label>
                <button onClick={handleReviewVisibility}>Update Visibility</button>
            </div>

            <div>
                <h3>Toggle User Status</h3>
                <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="User Email" />
                <label>
                    <input type="checkbox" checked={isDisabled} onChange={(e) => setIsDisabled(e.target.checked)} />
                    Disable User
                </label>
                <button onClick={handleUserStatus}>Toggle Status</button>
            </div>
        </div>
    );
};

export default Admin;
