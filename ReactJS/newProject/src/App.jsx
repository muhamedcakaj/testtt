import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './navBar';
import Login from './logIn';
import Home from './home/home';
import SignUp from './singUp';
import Footer from './Footer/footer';
import AdminDashboard from './adminDashBoard/dashboard';
import UserDashboard from './UserDashboard/userDashboard';
import User from './adminDashBoard/users';
import Products from './adminDashBoard/Products/products';
import Message from './adminDashBoard/Message/message'
import MessageButton from './MessageButton/messageButton'
import ProductOverview from './home/productOverView'
import ProductList from './home/productsList';
import ShoppingCart from './adminDashBoard/ShoppingCart/shoppingCart';
import WishList from './adminDashBoard/WishList/wishList';
import Checkout from './shoppingCart/checkout';
import ProductList2 from './home/productsList2';
import OrderList from './UserDashboard/orderList';
import OrderOverView from './UserDashboard/orderOverView'
import { AuthProvider } from './authProvider';
function App() {
    return (
        <>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <MessageButton />
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/LogInSingUp" element={<Login />} />
                        <Route path="/SingUp" element={<SignUp />} />
                        <Route path="/LogIn" element={<Login />} />
                        <Route path="/adminDashboard" element={<AdminDashboard />} />
                        <Route path="/userDashboard" element={<UserDashboard />} />
                        <Route path="/user" element={<User />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/message" element={<Message />} />
                        <Route path="/productOverView/:id" element={<ProductOverview />} />
                        <Route path="/" element={<ProductList />} />
                        <Route path="/shoppingCart" element={<ShoppingCart />} />
                        <Route path="/wishList" element={<WishList />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/productList2" element={<ProductList2 />} />
                        <Route path="/orderList" element={<OrderList />} />
                        <Route path="/order/:orderId" element={<OrderOverView />} />
                    </Routes>
                    <Footer />
                </Router>
            </AuthProvider>
        </>
    );
}

export default App;