import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        product_name: '',
        product_description: '',
        price: '',
        quantity: '',
        photo1_url: '',
        photo2_url: '',
        photo3_url: '',
        photo4_url: '',
        prodhuesi: '',
        garancioni: '',
        vend_iprodhimit: '',
        category: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    [name]: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/products', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Product added successfully:', response.data);
                onAdd(response.data);
                onClose();
            })
            .catch(error => {
                console.error('There was an error adding the product!', error);
            });
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add Product</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Description</label>
                            <input
                                type="text"
                                name="product_description"
                                value={formData.product_description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Photo 1</label>
                            <input
                                type="file"
                                name="photo1_url"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Photo 2</label>
                            <input
                                type="file"
                                name="photo2_url"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Photo 3</label>
                            <input
                                type="file"
                                name="photo3_url"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Photo 4</label>
                            <input
                                type="file"
                                name="photo4_url"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Prodhuesi</label>
                            <input
                                type="text"
                                name="prodhuesi"
                                value={formData.prodhuesi}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Garancioni</label>
                            <input
                                type="text"
                                name="garancioni"
                                value={formData.garancioni}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Vend i Prodhimit</label>
                            <input
                                type="text"
                                name="vend_iprodhimit"
                                value={formData.vend_iprodhimit}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select a Category</option>
                                <option value="Computers & Laptops">Computers & Laptops</option>
                                <option value="Gaming Accessories">Gaming Accessories</option>
                                <option value="Storage & Memory">Storage & Memory</option>
                                <option value="Software & Games">Software & Games</option>
                            </select>
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
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default AddProduct;