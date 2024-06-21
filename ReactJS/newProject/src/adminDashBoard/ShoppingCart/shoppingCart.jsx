import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddShoppingCart from './addShoppingCart';
import DeleteShoppingCart from './deleteShoppingCart';
import moment from 'moment';

const ShoppingCartDashboard = () => {
    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCart, setSelectedCart] = useState(null);
    const [userName, setUserName] = useState();
    const [products, setProducts] = useState();
    const [formData, setFormData] = useState({
        id: null,
        username_of_user: '',
        id_of_product: '',
        quantity: ''
    });

    useEffect(() => {
        fetchShoppingCarts();
        fetchUsernames();
        fetchProducts();
    }, []);

    const fetchShoppingCarts = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/shoppingCart', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                setShoppingCarts(response.data);
                console.log('Shopping Carts:', response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the shopping carts!', error);
            });
    };

    const fetchUsernames = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
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
        axios.get('http://localhost:8080/products/getAll')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error Fetching products:', error)
            })
    };

    const handleAddShoppingCart = (newCart) => {
        setShoppingCarts([...shoppingCarts, newCart]);
    };

    const handleUpdateShoppingCart = (updatedCart) => {
        setShoppingCarts(shoppingCarts.map(cart => (cart.id === updatedCart.id ? updatedCart : cart)));
    };

    const handleDeleteShoppingCart = (cartId) => {
        setShoppingCarts(shoppingCarts.filter(cart => cart.id !== cartId));
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCart(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedCart(null);
    };

    const handleEditShoppingCart = (cart) => {
        setSelectedCart(cart);
        setFormData({
            id: cart.id,
            username_of_user: cart.username_of_user,
            id_of_product: cart.id_of_product,
            quantity: cart.quantity
        });
        setIsEditModalOpen(true);
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
        const dataToSend = {
            username_of_user: formData.username_of_user,
            id_of_product: formData.id_of_product,
            quantity: formData.quantity
        };
        const token = sessionStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/shoppingCart/${formData.id}`, dataToSend, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {

                handleUpdateShoppingCart(response.data);
                closeEditModal();
                fetchShoppingCarts(); // Call fetchShoppingCarts function here
            })
            .catch(error => {
                console.error('There was an error updating the shopping cart!', error.response ? error.response.data : error.message);
            });
    };

    const resetFormData = () => {
        setFormData({
            id: null,
            username_of_user: '',
            id_of_Product: '',
            quantity: ''
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">Shopping Cart</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for shopping carts"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add Shopping Cart
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Surname</th>
                        <th className="py-2">UserName</th>
                        <th className="py-2">Product Name</th>
                        <th className="py-2">Product Price</th>
                        <th className="py-2">Product Photo</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {shoppingCarts.map((cart) => (
                        <tr key={cart.id} className="border-t">
                            <td className="py-2">{cart.id}</td>
                            <td className="py-2">{cart.user_id.name}</td>
                            <td className="py-2">{cart.user_id.surname}</td>
                            <td className="py-2">{cart.user_id.user_name}</td>
                            <td className="py-2">{cart.product_id.product_name}</td>
                            <td className="py-2">{cart.product_id.price}</td>
                            <td className="py-2">
                                <img src={cart.product_id.photo1_url} alt="Photo 1" width="50" />
                            </td>
                            <td className="py-2">{cart.quantity}</td>

                            <td className="py-2 space-x-2">
                                <button
                                    onClick={() => handleEditShoppingCart(cart)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { setSelectedCart(cart); setIsDeleteModalOpen(true); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddShoppingCart
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddShoppingCart}
            />
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit Shopping Cart</h2>
                            <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-900">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
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
                                    onClick={closeEditModal}
                                    className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-3 py-2 rounded-md"
                                >
                                    Save All
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <DeleteShoppingCart
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                cartId={selectedCart?.id}
                onDelete={handleDeleteShoppingCart}
            />
        </div>
    );
};

export default ShoppingCartDashboard;