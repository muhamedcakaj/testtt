import React, { useState } from 'react';
import axios from 'axios';

const MessageForm = ({ show, onClose }) => {
    const [feedback, setFeedback] = useState('');

    if (!show) {
        return null;
    }

    const handleSubmit = async (event) => {
        const userRole = sessionStorage.getItem('userName');
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/message', {
                content: feedback,
                username_user: userRole
            });
            if (response.status === 201) {
                console.log('Message sent successfully:', response.data);
                onClose();
            }
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Vlerso punën tonë</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        &times;
                    </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">Shënime</label>
                        <textarea
                            id="feedback"
                            rows="6"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Na tregoni për përvojën tuaj"
                            required
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Dërgo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MessageForm;