import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddWishList = ({ isOpen, onClose, onAdd }) => {
    const [userName, setUserName] = useState();
    const [products, setProducts] = useState();
    const [formData, setFormData] = useState({
        username_of_user: '',
        id_of_product: '',
    });
    const [error, setError] = useState('');
    const [wishList, setWishList] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchWishList();
            fetchUsernames();
            fetchProducts();
        }
    }, [isOpen]);

    useEffect(() => {
        fetchWishList();
        fetchUsernames();
        fetchProducts();
    }, []);

    const fetchWishList = () => {
        axios.get('http://localhost:8080/wishList')
            .then(response => {
                setWishList(response.data);
            })
            .catch(error => {
                console.error('Error fetching wish list:', error);
            });
    };
    const fetchUsernames = () => {
        axios.get('http://localhost:8080/users')
            .then(response => {
                setUserName(response.data);
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
            });
    };

    const fetchProducts = () => {
        axios.get('http://localhost:8080/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error Fetching products:', error)
            })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const exists = wishList.some(item => item.username_of_user === formData.username_of_user && item.id_of_product == formData.id_of_product);

        console.log(exists);

        if (exists) {
            setError('This wish list item already exists.');
            return;
        }

        // Perform validation
        if (!formData.username_of_user || !formData.id_of_product) {
            setError('Please enter both username and product ID.');
            return;
        }

        axios.post('http://localhost:8080/wishList', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                onAdd(response.data);
                onClose();
            })
            .catch(error => {
                setError('There was an error adding the wish list item.');
            });
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Wish List</h2>
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
                                <option key={user.id} value={user.username}>{user.user_name}</option>
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

export default AddWishList;