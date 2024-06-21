import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ isOpen, onClose, onAdd }) => {
  const [newMessage, setNewMessage] = useState({
    username_user: '',
    content: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8080/user/${newMessage.username_user}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        // Username exists, proceed with adding the message
        const messageResponse = await axios.post('http://localhost:8080/message', newMessage, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        onAdd(messageResponse.data);
        onClose();
      } else {
        // Username doesn't exist, set error message
        setErrorMessage(`The username "${newMessage.username_user}" doesn't exist in the database. Please try again.`);
      }
    } catch (error) {
      console.error('There was an error adding the message!', error);
      setErrorMessage('There was an error adding the message. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Message</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username_user"
                value={newMessage.username_user}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700">Content</label>
              <input
                type="text"
                name="content"
                value={newMessage.content}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
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
  );
};

export default AddUser;