import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrderItems = ({ isOpen, onClose, onAdd }) => {
    const [orders, setOrders] = useState();
    const [products, setProducts] = useState();
    const [formData, setFormData] = useState({
        id_of_order: '',
        id_of_product: '',
        quantity: '',
        price: '',
    });
    const [error, setError] = useState('');
    const [orderItems, setorderItems] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchWishList();

        }
    }, [isOpen]);

    useEffect(() => {
        fetchWishList();
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchWishList = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/orderItems', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setorderItems(response.data);
            })
            .catch(error => {
                console.error('Error fetching wish list:', error);
            });
    };
    const fetchOrders = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    };

    const fetchProducts = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/products/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
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

        const exists = orderItems.some(item => item.id_of_order === formData.id_of_order && item.id_of_product == formData.id_of_product);

        console.log(exists);

        if (exists) {
            setError('This order item already exists try to edit the quantity');
            return;
        }

        // Perform validation
        if (!formData.id_of_order || !formData.id_of_product) {
            setError('Please enter both order ID and product ID.');
            return;
        }
        const token = sessionStorage.getItem('jwtToken');
        axios.post('http://localhost:8080/orderItems', formData, {
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
                setError('There was an error adding the OrderItem.');
            });
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Order Item</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-500">{error}</div>}
                    <div className="mt-4">
                        <label className="block text-gray-700">Order ID</label>
                        <select
                            name="id_of_order"
                            value={formData.id_of_order}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select a Order ID</option>
                            {orders.map(order => (
                                <option key={order.id} value={order.username}>{order.id}</option>
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
                    <div className="mt-4">
                        <label className="block text-gray-700">Price</label>
                        <input
                            name="price"
                            value={formData.price}
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

export default AddOrderItems;