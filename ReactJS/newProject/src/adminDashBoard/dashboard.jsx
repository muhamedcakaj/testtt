import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Users from './users';
import Products from './Products/products';
import Message from './Message/message';
import ShoppingCart from './ShoppingCart/shoppingCart';
import Wishlist from './WishList/wishList';
import OrderItems from './OrderItems/orderItems'
import Orders from './Orders/orders'

const Dashboard = () => {
  const [selectedLink, setSelectedLink] = useState('dashboard'); // Initially set to dashboard

  // Function to render the selected option
  const renderSelectedOption = () => {
    switch (selectedLink) {
      case 'message':
        return <Message />;
      case 'user':
        return <Users />;
      case 'products':
        return <Products />;
      case 'shoppingCart':
        return <ShoppingCart />;
      case 'wishList':
        return <Wishlist />;
      case 'orderItems':
        return <OrderItems />;
      case 'orders':
        return <Orders />;
      default:
        return <h2 className="text-2xl font-semibold">Welcome, Admin!</h2>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <nav className="mt-5">
            <ul>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'dashboard' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('dashboard')}
              >
                <Link to="/adminDashboard">Dashboard</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'inbox' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('message')}
              >
                <Link to="/message">Message</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'users' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('user')}
              >
                <Link to="/user">Users</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'products' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('products')}
              >
                <Link to="/products">Products</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'shoppingCart' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('shoppingCart')}
              >
                <Link to="/shoppingCart">Shopping Cart</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'wishList' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('wishList')}
              >
                <Link to="/wishList">WishList</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'orderItems' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('orderItems')}
              >
                <Link to="/wishList">Order Items</Link>
              </li>
              <li
                className={`p-4 hover:bg-gray-200 cursor-pointer ${selectedLink === 'orders' && 'bg-gray-200'}`}
                onClick={() => setSelectedLink('orders')}
              >
                <Link to="/orders">Orders</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4">
          {/* Render the selected option */}
          {renderSelectedOption()}
        </main>
      </div>
    </div>
  );
};


export default Dashboard;