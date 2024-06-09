import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUser from './addUser';
import DeleteUser from './deleteUser';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        surname: '',
        user_email: '',
        user_name: '',
        name: '',
        role: '',
        user_address: '',
        user_telephone_number: '',
        passwordd: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:8080/users')
            .then(response => {
                setUsers(response.data);
                console.log('Users:', response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    };

    const handleAddUser = (newUser) => {
        setUsers([...users, newUser]);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    };

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        resetFormData();
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setFormData({
            id: user.id,
            surname: user.surname || '',
            user_email: user.user_email || '',
            user_name: user.user_name || '',
            name: user.name || '',
            user_address: user.user_address || '',
            user_telephone_number: user.user_telephone_number || '',
            passwordd: user.passwordd || '',
            role: user.role || ''
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
        const dataToSend = { ...formData };
        axios.put(`http://localhost:8080/user/${formData.id}`, dataToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('User data updated successfully:', response.data);
                handleUpdateUser(response.data);
                closeEditModal();
                fetchUsers(); // Call fetchUsers function here
            })
            .catch(error => {
                console.error('There was an error updating the user!', error.response ? error.response.data : error.message);
            });
    };

    const resetFormData = () => {
        setFormData({
            id: null,
            surname: '',
            user_email: '',
            user_name: '',
            name: '',
            role: '',
            user_address: '',
            user_telephone_number: '',
            passwordd: ''
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">All Users</h2>
            
            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for users"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add User
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Surname</th>
                        <th className="py-2">Username</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Password</th>
                        <th className="py-2">Phone Number</th>
                        <th className="py-2">Address</th>
                        <th className="py-2">User Role</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="py-2">{user.id}</td>
                            <td className="py-2">{user.name}</td>
                            <td className="py-2">{user.surname}</td>
                            <td className="py-2">{user.user_name}</td>
                            <td className="py-2">{user.user_email}</td>
                            <td className="py-2">{user.passwordd}</td>
                            <td className="py-2">{user.user_telephone_number}</td>
                            <td className="py-2">{user.user_address}</td>
                            <td className="py-2">{user.role}</td>
                            <td className="py-2 space-x-2">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit User
                                </button>
                                <button
                                    onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddUser
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
            />
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit User</h2>
                            <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-900">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Surname</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        value={formData.user_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Password</label>
                                    <input
                                        type="text"
                                        name="passwordd"
                                        value={formData.passwordd}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        value={formData.user_email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Phone Number</label>
                                    <input
                                        type="text"
                                        name="user_telephone_number"
                                        value={formData.user_telephone_number}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="user_address"
                                        value={formData.user_address}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">User Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
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
            <DeleteUser
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                userId={selectedUser?.id}
                onDelete={handleDeleteUser}
            />
        </div>
    );
};

export default Users;