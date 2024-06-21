import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [userName, setuserName] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setuserName(payload.sub);
        }
    }, []);

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                const token = sessionStorage.getItem('jwtToken');
                const response = await axios.get(`http://localhost:8080/wishList/${userName}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setWishlistItems(response.data);
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            }
        };

        if (userName) {
            fetchWishlistItems();
        }

    }, [userName]);

    return (
        <>
            <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Wishlist</h1>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Wishlist Items</h2>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {wishlistItems.map((item) => (
                            <Link to={`/productOverView/${item.id_of_product}`} className="group" key={item.id}>
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={item.product.photo1_url}
                                        alt={item.product.product_description}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{item.product.product_name}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">${item.product.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wishlist;