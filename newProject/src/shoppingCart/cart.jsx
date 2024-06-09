import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function ShoppingCart({ onClose }) {
    const [shoppingCartItems, setShoppingCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [message, setMessage] = useState();

    useEffect(() => {
        const userName = sessionStorage.getItem('userName'); // Replace with actual username
        axios.get(`http://localhost:8080/shoppingCarts/${userName}`)
            .then(response => {
                console.log('Shopping Carts for user:', response.data);
                setShoppingCartItems(response.data);
                calculateSubtotal(response.data);
            })
            .catch(error => {
                console.error('Error fetching shopping carts:', error);
            });
    }, []);

    const handleClose = () => {
        onClose();
    };

    const handleRemoveCart = (cartId) => {
        axios.delete(`http://localhost:8080/shoppingCart/${cartId}`)
            .then(() => {
                const updatedItems = shoppingCartItems.filter(cart => cart.id !== cartId);
                setShoppingCartItems(updatedItems);
                calculateSubtotal(updatedItems);
                localStorage.setItem('shoppingCartChanged', Date.now().toString());
            })
            .catch(error => {
                console.error('There was an error deleting the shopping cart!', error);
            });
    };

    const calculateSubtotal = (cartItems) => {
        const subtotalValue = cartItems.reduce((total, cart) => total + (cart.product_id.price * cart.quantity), 0);
        setSubtotal(subtotalValue);
    };

    const handleCheckout = () => {
        if (shoppingCartItems.length == 0) {
            setMessage("Your cart is empty. Please add some items to checkout.");
        } else {
            navigate('/checkout');
            handleClose()
        }
    };

    const handleCheckoutButton = () => {
        handleCheckout();
    };

    const navigate = useNavigate();

    return (
        <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        {/* Slide-over panel */}
                        <div className="pointer-events-auto w-screen max-w-md">
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button onClick={handleClose} type="button" className="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                                                <span className="absolute -inset-0.5"></span>
                                                <span className="sr-only">Close panel</span>
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {shoppingCartItems.length > 0 ? (
                                        <div className="mt-8">
                                            <div className="flow-root">
                                                <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                    {shoppingCartItems.map(cart => (
                                                        <li key={cart.id} className="flex py-6">
                                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                <img src={cart.product_id.photo1_url} alt={cart.product_id.name} className="h-full w-full object-cover object-center" />
                                                            </div>

                                                            <div className="ml-4 flex flex-1 flex-col">
                                                                <div>
                                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                                        <h3>
                                                                            <a href="#">{cart.product_id.name}</a>
                                                                        </h3>
                                                                        <p className="ml-4">${cart.product_id.price}</p>
                                                                    </div>
                                                                    <p className="mt-1 text-sm text-gray-500">{cart.product_id.product_description}</p>
                                                                </div>
                                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                                    <p className="text-gray-500">Sasia : {cart.quantity}</p>

                                                                    <div className="flex">
                                                                        <button type="button" onClick={() => handleRemoveCart(cart.id)} className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>No items in the shopping cart.</p>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <p>Shuma Totale</p>
                                        <p>${subtotal.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        {message ? (
                                            <p className="text-center text-gray-600">{message}</p>
                                        ) : (
                                            <button
                                                className="flex items-center justify-center rounded-full bg-indigo-600 px-10 py-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={handleCheckout}
                                                style={{ width: '100%' }} // Added inline style to set width to 100%
                                            >
                                                Checkout
                                            </button>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                        <p>
                                            <button
                                                onClick={handleClose}
                                                type="button"
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                            >
                                                Continue Shopping
                                                <span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ShoppingCart;