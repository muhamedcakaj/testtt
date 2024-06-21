import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMessage from './addMessage';
import DeleteMessage from './deleteMessage';
import moment from 'moment';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
        content: '',
        user_name: '',
        user_surname: '',
        user_username: '',
        createdAt: ''
    });

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = () => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get('http://localhost:8080/message', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setMessages(response.data);
                console.log('Messages:', response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the messages!', error);
            });
    };

    const handleAddMessage = (newMessage) => {
        setMessages([...messages, newMessage]);
    };

    const handleUpdateMessage = (updatedMessage) => {
        setMessages(messages.map(message => (message.id === updatedMessage.id ? updatedMessage : message)));
    };

    const handleDeleteMessage = (messageId) => {
        setMessages(messages.filter(message => message.id !== messageId));
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedMessage(null);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedMessage(null);
    };

    const handleEditMessage = (message) => {
        setSelectedMessage(message);
        setFormData({
            id: message.id,
            content: message.content,
            user_name: message.user_name,
            user_surname: message.user_surname,
            user_username: message.user_username,
            createdAt: message.createdAt
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
        const token = sessionStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/message/${formData.id}`, dataToSend, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Message data updated successfully:', response.data);
                handleUpdateMessage(response.data);
                closeEditModal();
                fetchMessages(); // Call fetchMessages function here
            })
            .catch(error => {
                console.error('There was an error updating the message!', error.response ? error.response.data : error.message);
            });
    };

    const resetFormData = () => {
        setFormData({
            id: null,
            content: '',
            user_name: '',
            user_surname: '',
            user_username: '',
            createdAt: ''
        });
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">All Messages</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for messages"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add Message
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Content</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Surname</th>
                        <th className="py-2">Username</th>
                        <th className="py-2">Created At</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((message) => (
                        <tr key={message.id} className="border-t">
                            <td className="py-2">{message.id}</td>
                            <td className="py-2">{message.content}</td>
                            <td className="py-2">{message.user.name}</td>
                            <td className="py-2">{message.user.surname}</td>
                            <td className="py-2">{message.user.user_name}</td>
                            <td className="py-2">{moment(message.created_at).format('YYYY-MM-DD - HH:mm')}</td>
                            <td className="py-2 space-x-2">
                                <button
                                    onClick={() => handleEditMessage(message)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit Message
                                </button>
                                <button
                                    onClick={() => { setSelectedMessage(message); setIsDeleteModalOpen(true); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete Message
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddMessage
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMessage}
            />
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit Message</h2>
                            <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-900">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-gray-700">Content</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                        style={{ height: '150px' }}
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
            <DeleteMessage
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                messageId={selectedMessage?.id}
                onDelete={handleDeleteMessage}
            />
        </div>
    );
};

export default Messages;