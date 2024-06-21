import React from 'react';
import axios from 'axios';

const DeleteWishList = ({ isOpen, onClose, cartId, onDelete }) => {
    const handleDelete = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.delete(`http://localhost:8080/orders/${cartId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('WishList deleted successfully:', response.data);
                onDelete(cartId);
                onClose();
            })
            .catch(error => {
                console.error('There was an error deleting the shopping cart!', error.response ? error.response.data : error.message);
            });
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Delete Wish List</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <div className="mt-4">
                    <p>Are you sure you want to delete this Wish List</p>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-3 py-2 rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default DeleteWishList;