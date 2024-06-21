import React from 'react';
import axios from 'axios';

const DeleteProduct = ({ isOpen, onClose, productId, onDelete }) => {
    const handleDelete = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.delete(`http://localhost:8080/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Product deleted successfully:', response.data);
                onDelete(productId);
                onClose();
            })
            .catch(error => {
                console.error('There was an error deleting the product!', error.response ? error.response.data : error.message);
            });
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Delete Product</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <p>Are you sure you want to delete this product?</p>
                <div className="mt-4 flex justify-end">
                    <button
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
    ) : null;
};

export default DeleteProduct;