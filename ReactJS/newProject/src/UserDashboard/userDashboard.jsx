import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Wishlist from './wishList';  // Import the Wishlist component
import OrderList from './orderList';

const UserDashboard = () => {
    const [userName, setUserName] = useState('');
    const [userData, setUserData] = useState({
        id: null,
        surname: '',
        password: '',
        user_email: '',
        user_name: '',
        namee: '',
        role: '',
        user_address: '',
        user_telephone_number: ''
    });
    const [originalUserData, setOriginalUserData] = useState({});
    const [activeTab, setActiveTab] = useState('personal-details');
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserName(payload.sub);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/user/${userName}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    } 
                });
                const userDataFromApi = response.data;
                setUserData(userDataFromApi);
                setOriginalUserData(userDataFromApi); // Set original user data
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
            const token = sessionStorage.getItem('jwtToken');
            console.log("here2");
            console.log(token);
        };

        if (userName) {
            fetchUserData();
        }
    }, [userName]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleEditClick = () => {
        setEditable(true);
    };

    const handleSaveClick = async () => {
        try {
            const dataToUpdate = {};
            // Loop through userData to find changed fields
            for (const key in userData) {
                if (userData.hasOwnProperty(key)) {
                    if (userData[key] !== originalUserData[key]) {
                        dataToUpdate[key] = userData[key];
                    }
                }
            }
            const token = sessionStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/user/${userData.id}`, dataToUpdate, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setEditable(false);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 px-8 py-10 bg-white rounded-lg shadow-lg">
            <div className="flex">
                <div className="w-1/4 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg p-6 shadow-lg text-white">
                    <h2 className="text-3xl font-bold mb-8">Welcome {userName}</h2>
                    <ul className="space-y-4 text-lg">
                        <li
                            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'personal-details' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
                            onClick={() => handleTabClick('personal-details')}
                        >
                            Personal Details
                        </li>
                        <li
                            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'wishlist' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
                            onClick={() => handleTabClick('wishlist')}
                        >
                            Wishlist
                        </li>
                        <li
                            className={`cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'orders' ? 'bg-blue-700' : 'hover:bg-blue-500'}`}
                            onClick={() => handleTabClick('orders')}
                        >
                            Orders
                        </li>
                    </ul>
                </div>
                <div className="w-3/4 ml-6">
                    {activeTab === 'personal-details' && (
                        <div id="personal-details" className="bg-white rounded-lg p-6 shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="mb-4">
                                    <label className="block text-lg font-semibold text-gray-700">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-semibold text-gray-700">Surname:</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={userData.surname}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-semibold text-gray-700">Telephone Number:</label>
                                    <input
                                        type="text"
                                        name="user_telephone_number"
                                        value={userData.user_telephone_number}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-semibold text-gray-700">Address:</label>
                                    <textarea
                                        name="user_address"
                                        value={userData.user_address}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-lg font-semibold text-gray-700">Email:</label>
                                    <input
                                        type="email"
                                        name="user_email"
                                        value={userData.user_email}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-1 p-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                            </div>
                            {!editable ? (
                                <button
                                    onClick={handleEditClick}
                                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                                >
                                    Edit
                                </button>
                            ) : (
                                <button
                                    onClick={handleSaveClick}
                                    className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    )}
                    {activeTab === 'wishlist' && (
                        <Wishlist />  // Render Wishlist component
                    )}
                    {activeTab === 'orders' && (
                        <OrderList />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;