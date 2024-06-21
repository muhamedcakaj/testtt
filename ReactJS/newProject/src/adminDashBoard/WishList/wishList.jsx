import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddWishList from './addWishList';
import DeleteWishList from './deleteWishList';
import moment from 'moment';

const WishListDashboard = () => {
    const [wishList, setwishList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWishList, setSelectedWishList] = useState(null);
    const [userName, setUserName] = useState();
    const [products, setProducts] = useState();
    const [formData, setFormData] = useState({
        id: null,
        username_of_user: '',
        id_of_product: '',
    });

    useEffect(() => {
        fetchWishList();
        fetchUsernames();
        fetchProducts();
    }, []);

    const fetchWishList = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/wishList', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
        axios.get('http://localhost:8080/products/getAll')
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
            username_of_user: wishList.username_of_user,
            id_of_product: wishList.id_of_product,
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
        };
        const token = sessionStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/wishList/${formData.id}`, dataToSend, {
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
            username_of_user: '',
            id_of_Product: '',
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">WishList</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for WishList"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add WishList
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
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {wishList.map((wishList) => (
                        <tr key={wishList.id} className="border-t">
                            <td className="py-2">{wishList.id}</td>
                            <td className="py-2">{wishList.user.name}</td>
                            <td className="py-2">{wishList.user.surname}</td>
                            <td className="py-2">{wishList.user.user_name}</td>
                            <td className="py-2">{wishList.product.product_name}</td>
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