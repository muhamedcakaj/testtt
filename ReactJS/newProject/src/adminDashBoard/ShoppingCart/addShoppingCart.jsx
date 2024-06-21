import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddShoppingCart = ({ isOpen, onClose, onAdd }) => {
    const [userName, setUserName] = useState();
    const [products, setProducts] = useState();
    const [formData, setFormData] = useState({
        username_of_user: '',
        id_of_product: '',
        quantity: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const fetchUsernames = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setUserName(response.data);
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
            });
    };

    const fetchProducts = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/products/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error Fetching products:', error)
            })
    };
    useEffect(() => {
        fetchUsernames();
        fetchProducts();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        // Perform validation
        if (!formData.username_of_user || !formData.id_of_product) {
            setError('Please enter both username and product ID.');
            console.log();
            return;
        }

        const token = sessionStorage.getItem('jwtToken');
        axios.post('http://localhost:8080/shoppingCart', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Shopping Cart added successfully:', response.data);
                onAdd(response.data);
                onClose();
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setError('Username or product ID does not exist.');
                } else {
                    setError('There was an error adding the shopping cart.');
                }
            });
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Shopping Cart</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="mt-4">
                        <label className="block text-gray-700">Username of User</label>
                        <select
                            name="username_of_user"
                            value={formData.username_of_user}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a user</option>
                            {userName.map(user => (
                                <option key={user.id} value={user.username}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Product ID</label>
                        <select
                            name="id_of_product"
                            value={formData.id_of_product}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a Product ID</option>
                            {products.map(products => (
                                <option key={products.id} value={products.id}>{products.id}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Quantity</label>
                        <input
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-3 py-2 rounded-md"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default AddShoppingCart;