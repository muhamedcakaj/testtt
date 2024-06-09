import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './addProduct';
import DeleteProduct from './DeleteProduct';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: null,
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:8080/products')
            .then(response => {
                setProducts(response.data);
                console.log('Products:', response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    };

    const handleAddProduct = (newProduct) => {
        setProducts([...products, newProduct]);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setProducts(products.map(product => (product.id === updatedProduct.id ? updatedProduct : product)));
    };

    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(product => product.id !== productId));
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
        resetFormData();
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setFormData({
            id: product.id,
            product_name: product.product_name || '',
            product_description: product.product_description || '',
            price: product.price || '',
            quantity: product.quantity || '',
            photo1_url: product.photo1_url || '',
            photo2_url: product.photo2_url || '',
            photo3_url: product.photo3_url || '',
            photo4_url: product.photo4_url || '',
            prodhuesi: product.prodhuesi || '',
            garancioni: product.garancioni || '',
            vend_iprodhimit: product.vend_iprodhimit || '',
            category: product.category || ''
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
        const dataToSend = { ...formData };
        axios.put(`http://localhost:8080/products/${formData.id}`, dataToSend, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Product data updated successfully:', response.data);
                handleUpdateProduct(response.data);
                closeEditModal();
                fetchProducts(); // Call fetchProducts function here
            })
            .catch(error => {
                console.error('There was an error updating the product!', error.response ? error.response.data : error.message);
            });
    };

    const resetFormData = () => {
        setFormData({
            id: null,
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
    };

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">All Products</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for products"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add Product
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Description</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2">Photo 1</th>
                        <th className="py-2">Photo 2</th>
                        <th className="py-2">Photo 3</th>
                        <th className="py-2">Photo 4</th>
                        <th className="py-2">Prodhuesi</th>
                        <th className="py-2">Garancioni</th>
                        <th className="py-2">Vend i Prodhimit</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-t">
                            <td className="py-2">{product.id}</td>
                            <td className="py-2">{product.product_name}</td>
                            <td className="py-2">{product.product_description}</td>
                            <td className="py-2">{product.price}</td>
                            <td className="py-2">{product.quantity}</td>
                            <td className="py-2">
                                <img src={product.photo1_url} alt="Photo 1" width="50" />
                            </td>
                            <td className="py-2">
                                <img src={product.photo2_url} alt="Photo 2" width="50" />
                            </td>
                            <td className="py-2">
                                <img src={product.photo3_url} alt="Photo 3" width="50" />
                            </td>
                            <td className="py-2">
                                <img src={product.photo4_url} alt="Photo 4" width="50" />
                            </td>
                            <td className="py-2">{product.prodhuesi}</td>
                            <td className="py-2">{product.garancioni}</td>
                            <td className="py-2">{product.vend_iprodhimit}</td>
                            <td className="py-2">{product.category}</td>
                            <td className="py-2 space-x-2">
                                <button
                                    onClick={() => handleEditProduct(product)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit Product
                                </button>
                                <button
                                    onClick={() => { setSelectedProduct(product); setIsDeleteModalOpen(true); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete Product
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddProduct
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProduct}
            />
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit Product</h2>
                            <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-900">&times;</button>
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
            <DeleteProduct
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                productId={selectedProduct?.id}
                onDelete={handleDeleteProduct}
            />
        </div>
    );
};

export default Products;