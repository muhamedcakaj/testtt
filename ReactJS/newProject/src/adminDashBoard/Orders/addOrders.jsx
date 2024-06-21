import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        username_of_user: '',
        country: '',
        city: '',
        address: '',
        status: '',
        total: '',
        type_of_transport: '',
    });
    const [error, setError] = useState('');
    const [wishList, setWishList] = useState([]);
    const [usernames, setUsernames] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchWishList();
            fetchUsernames();
        }
    }, [isOpen]);

    useEffect(() => {
        fetchWishList();
    }, []);

    const fetchWishList = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setWishList(response.data);
            })
            .catch(error => {
                console.error('Error fetching wish list:', error);
            });
    };

    const fetchUsernames = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setUsernames(response.data);
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
            });
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
        
        // Perform validation
        if (!formData.username_of_user) {
            setError('Please enter both username and product ID.');
            return;
        }
        const token = sessionStorage.getItem('jwtToken');
        axios.post('http://localhost:8080/orders', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
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
                    <h2 className="text-xl font-semibold">Add Orders</h2>
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
                            {usernames.map(user => (
                                <option key={user.id} value={user.username}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Country</label>
                        <input
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">City</label>
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a status</option>
                            <option value="Ne procesim">Ne procesim</option>
                            <option value="E verifikuar">E verifikuar</option>
                            <option value="E pergaditur">E pergaditur</option>
                            <option value="E dorezuar te Postieri">E dorezuar te Postieri</option>
                            <option value="E pranuar nga Klienti">E pranuar nga Klienti</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Total</label>
                        <input
                            type='number'
                            name="total"
                            value={formData.total}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Type of Transport</label>
                        <input
                            name="type_of_transport"
                            value={formData.type_of_transport}
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

export default AddOrder;