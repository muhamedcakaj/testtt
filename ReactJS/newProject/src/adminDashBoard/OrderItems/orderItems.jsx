import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddWishList from './addOrderItems';
import DeleteWishList from './deleteOrderItems';
import moment from 'moment';

const WishListDashboard = () => {
    const [wishList, setwishList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWishList, setSelectedWishList] = useState(null);
    const [orders, setOrders] = useState();
    const [products, setProducts] = useState();
    const [formData, setFormData] = useState({
        id: null,
        id_of_order: '',
        id_of_product: '',
        price: '',
        quantity: '',
    });

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
                setwishList(response.data);
                console.log('WishList:', response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the shopping carts!', error);
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

    const handleAddWishList = (newWishList) => {
        setwishList([...wishList, newWishList]);
    };

    const handleUpdateWishList = (updatedWishList) => {
        setwishList(wishList.map(wishList => (wishList.id === updatedWishList.id ? updatedWishList : wishList)));
    };

    const handleDeleteWishList = (WishListId) => {
        setwishList(wishList.filter(wishList => wishList.id !== WishListId));
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedWishList(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedWishList(null);
    };

    const handleEditWishList = (wishList) => {
        setSelectedWishList(wishList);
        setFormData({
            id: wishList.id,
            id_of_order: wishList.id_of_order,
            id_of_product: wishList.id_of_product,
            quantity: wishList.quantity,
            price: wishList.price,
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
            id_of_order: formData.id_of_order,
            id_of_product: formData.id_of_product,
            price: formData.price,
            quantity: formData.quantity,
        };
        const token = sessionStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/orderItems/${formData.id}`, dataToSend, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {

                handleUpdateWishList(response.data);
                closeEditModal();
                fetchWishList();
            })
            .catch(error => {
                console.error('There was an error updating the shopping cart!', error.response ? error.response.data : error.message);
            });
    };

    const resetFormData = () => {
        setFormData({
            id: null,
            id_of_order: '',
            id_of_Product: '',
            price: '',
            quantity: '',
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">Order Items</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for Order Items"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add Order Items
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Product Name</th>
                        <th className="py-2">Order Id</th>
                        <th className="py-2">Id of Product</th>
                        <th className="py-2">Quantity of the Product</th>
                        <th className="py-2">Product Price</th>
                        <th className="py-2">Product Photo</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {wishList.map((wishList) => (
                        <tr key={wishList.id} className="border-t">
                            <td className="py-2">{wishList.id}</td>
                            <td className="py-2">{wishList.product.product_name}</td>
                            <td className="py-2">{wishList.id_of_order}</td>
                            <td className="py-2">{wishList.product.id}</td>
                            <td className="py-2">{wishList.quantity}</td>
                            <td className="py-2">{wishList.product.price}</td>
                            <td className="py-2">
                                <img src={wishList.product.photo1_url} alt="Photo 1" width="50" />
                            </td>
                            <td className="py-2 space-x-2">
                                <button
                                    onClick={() => handleEditWishList(wishList)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { setSelectedWishList(wishList); setIsDeleteModalOpen(true); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddWishList
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddWishList}
            />
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit Wish List</h2>
                            <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-900">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="block text-gray-700">Order ID</label>
                                <select
                                    name="id_of_order"
                                    value={formData.id_of_order}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Select a user</option>
                                    {orders.map(orders => (
                                        <option key={orders.id} value={orders.username}>{orders.id}</option>
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
                                <label className="block text-gray-700">Price</label>
                                <input
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                />
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
            <DeleteWishList
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                cartId={selectedWishList?.id}
                onDelete={handleDeleteWishList}
            />
        </div>
    );
};

export default WishListDashboard;