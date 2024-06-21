import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { loginUser } from './api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token, refreshToken } = await loginUser(username, password);
            const payload = JSON.parse(atob(token.split('.')[1]));
            sessionStorage.setItem('jwtToken', token);
            sessionStorage.setItem('refreshToken', refreshToken);

            console.log("Initial tokens:");
            console.log("Token:", token);
            console.log("Refresh Token:", refreshToken);

            if (payload.role === "ADMIN") {
                setLoggedIn(true);
                setUserRole("ADMIN");
                sessionStorage.setItem('loggedIn', true);
            } else if (payload.role === "USER") {
                setLoggedIn(true);
                setUserRole("USER");
                sessionStorage.setItem('loggedIn', true);
            }

        } catch (error) {
            setLoginError(error.message);
        }
    }

    useEffect(() => {
        if (loggedIn && userRole === "USER") {
            window.location.reload();
        }
    }, [loggedIn, userRole]);

    if (loggedIn) {
        if (userRole === "USER") {
            return <Navigate to="/home" />;
        } else if (userRole === "ADMIN") {
            return <Navigate to="/adminDashboard" />;
        }
    }

    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
                    </div>
                    {loginError && (
                        <div className="text-red-500 text-center">{loginError}</div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="username" className="sr-only" id="Username">Username</label>
                                <input id="username" name="username" type="text" autoComplete="username" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only" id="Password">Password</label>
                                <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Login
                            </button>
                        </div>
                    </form>
                    <ul>
                        <li>
                            <Link to="/SingUp">
                                <p className="text-center text-sm mt-4">Don't have an account? <button className="text-blue-500 underline focus:outline-none">Sign Up</button></p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Login;