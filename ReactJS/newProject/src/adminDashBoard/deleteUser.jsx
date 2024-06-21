import React from 'react';
import axios from 'axios';

const DeleteUser = ({ isOpen, onClose, userId, onDelete }) => {
    const handleDelete = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.delete(`http://localhost:8080/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                onDelete(userId);
                onClose();
            })
            .catch(error => {
                console.error('There was an error deleting the user!', error);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-2xl mb-4">Delete User</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded-md">Cancel</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;