import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddWishList from './addOrders';
import DeleteWishList from './deleteOrders';
import moment from 'moment';

const WishListDashboard = () => {
    const [wishList, setwishList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWishList, setSelectedWishList] = useState(null);
    const [userName, setUserName] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        total: '',
        status: '',
        created_at: '',
        username_of_user: '',
        country: '',
        city: '',
        address: '',
        type_of_transport: '',
    });

    useEffect(() => {
        fetchWishList();
        fetchUsernames();
    }, []);

    const fetchWishList = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setwishList(response.data);
                console.log('WishList:', response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the Orders!', error);
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
                setUserName(response.data);
            })
            .catch(error => {
                console.error('Error fetching usernames:', error);
            });
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
            total: wishList.total,
            status: wishList.status,
            username_of_user: wishList.username_of_user,
            country: wishList.country,
            city: wishList.city,
            address: wishList.address,
            type_of_transport: wishList.type_of_transport
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
            country: formData.country,
            city: formData.city,
            address: formData.address,
            status: formData.status,
            total: formData.total,
            type_of_transport: formData.type_of_transport
        };
        console.log(formData.id);
        const token = sessionStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/orders/${formData.id}`, dataToSend, {
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
            total: '',
            status: '',
            username_of_user: '',
            country: '',
            city: '',
            address: '',
            type_of_transport: '',
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">Orders</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for Orders"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add Orders
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Surname</th>
                        <th className="py-2">Country</th>
                        <th className="py-2">City</th>
                        <th className="py-2">Address</th>
                        <th className="py-2">Type of Transport</th>
                        <th className="py-2">Created Time</th>
                        <th className="py-2">Total</th>
                        <th className="py-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {wishList.map((wishList) => (
                        <tr key={wishList.id} className="border-t">
                            <td className="py-2">{wishList.id}</td>
                            <td className="py-2">{wishList.user.name}</td>
                            <td className="py-2">{wishList.user.surname}</td>
                            <td className="py-2">{wishList.country}</td>
                            <td className="py-2">{wishList.city}</td>
                            <td className="py-2">{wishList.address}</td>
                            <td className="py-2">{wishList.type_of_transport}</td>
                            <td className="py-2">{moment(wishList.created_at).format('YYYY-MM-DD - HH:mm')}</td>
                            <td className="py-2">{wishList.total}</td>
                            <td className="py-2">{wishList.status}</td>
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
                                    <option value="">{formData.status}</option>
                                    <option value="E Verifikuar">E Verifikuar</option>
                                    <option value="E Pergaditur">E Pergaditur</option>
                                    <option value="E Dorezuar tek Postieri">E Dorezuar tek Postieri</option>
                                    <option value="E Pranuar nga Klienti">E Pranuar nga Klienti</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Total</label>
                                <input
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