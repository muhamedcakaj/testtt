import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import IMG from './img/Icon.png';
import IMG2 from './img/Cart.jpg';
import ShoppingCart from './shoppingCart/cart';

const Navbar = () => {
    const [onClick, setOnClick] = useState(false);
    const token = sessionStorage.getItem('jwtToken');
    const loggedIn = sessionStorage.getItem('loggedIn');
    console.log();
    let userRole = null;
    if (token) {
        try {
            userRole = JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Error parsing token:', error);
        }
    }
    const navigate = useNavigate();
    const [showCart, setShowCart] = useState(false);

    const handleSignOut = () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('jwtToken')
        navigate('/home');
        window.location.reload();
    }
    const handleToggleCart = () => {
        setShowCart(!showCart);
        const cart = document.getElementById('cart');
        cart.classList.toggle('hidden');
    };
    if (loggedIn && userRole.role == 'USER') {
        return (
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <Link to="/home">
                                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <ul>
                                        <li>
                                            <Link to="/productList2" state={{ category: 'Computers & Laptops' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Computers & Laptops</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Gaming Accessories' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Gaming Accessories</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Storage & Memory' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Storage & Memory</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Software & Games' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Software & Games</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button onClick={handleToggleCart} type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5"></span>
                                <span className="sr-only">View cart</span>
                                <img className="h-8 w-8 rounded-full" src={IMG2} alt="Cart" />
                            </button>
                            <div className="relative ml-3">
                                <div>
                                    <ul>
                                        <li>

                                            <button onClick={() => setOnClick(!onClick)} type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                                <span className="absolute -inset-1.5"></span>
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src={IMG} alt="" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                {onClick && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                        <Link to="/userDashboard" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1">Llogaria ime</Link>
                                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1">Çkyqu</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {showCart && (
                    <div id="cart" className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                        <ShoppingCart onClose={handleToggleCart} />
                    </div>
                )}
            </nav>
        );
    }
    else if (loggedIn && userRole.role == 'ADMIN') {
        return (
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <Link to="/home">
                                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <ul>
                                        <li>
                                            <Link to="/productList2" state={{ category: 'Computers & Laptops' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Computers & Laptops</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Gaming Accessories' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Gaming Accessories</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Storage & Memory' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Storage & Memory</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Software & Games' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Software & Games</span>
                                            </Link>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="relative ml-3">
                                <div>
                                    <ul>
                                        <li>
                                            <button onClick={() => setOnClick(!onClick)} type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                                <span className="absolute -inset-1.5"></span>
                                                <span className="sr-only">Open user menu</span>
                                                <img className="h-8 w-8 rounded-full" src={IMG} alt="" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                {onClick && (
                                    <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                        <Link to="/adminDashboard" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1">Dashboard</Link>
                                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1">Çkyqu</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            </nav >
        );
    }
    else {
        return (
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <Link to="/home">
                                <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                            </Link>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <ul>
                                        <li>
                                            <Link to="/productList2" state={{ category: 'Computers & Laptops' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Computers & Laptops</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Gaming Accessories' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Gaming Accessories</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Storage & Memory' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Storage & Memory</span>
                                            </Link>
                                            <Link to="/productList2" state={{ category: 'Software & Games' }}>
                                                <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Software & Games</span>
                                            </Link>
                                        </li>
                                    </ul>

                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="relative ml-3">
                                <div>
                                    <ul>
                                        <li>
                                            <Link to="/LogInSingUp">
                                                <button type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                                    <span className="absolute -inset-1.5"></span>
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-8 w-8 rounded-full" src={IMG} alt="" />
                                                </button>
                                            </Link>
                                        </li>
                                    </ul>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="sm:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <a href="#" className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Home</a>
                        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>
                        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>
                        <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
                    </div>
                </div>
            </nav >
        );
    }
}
export default Navbar;