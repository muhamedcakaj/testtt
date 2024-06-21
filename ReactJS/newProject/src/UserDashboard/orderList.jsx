import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userName = payload.sub;
        if (userName) {
            axios.get(`http://localhost:8080/orders/findUserOrders/${userName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Fetched orders:', response.data); // Log the response to inspect the structure
                    const fetchedOrders = response.data.map(order => {
                        const imageUrls = order.order_items.map(item => item.product.photo1_url);
                        return { ...order, imageUrls };
                    });
                    setOrders(fetchedOrders);
                })
                .catch(error => console.error('Error fetching orders:', error));
        }
    }, []);

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-5">Porositë</h1>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <Link key={order.id} to={`/order/${order.id}`}>
                        <div key={order.id} className="bg-white p-5 shadow-md rounded mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p><strong>Numri i porosisë:</strong> #{order.id}</p>
                                    <p><strong>Data e porosisë:</strong> {moment(order.created_at).format('YYYY-MM-DD - HH:mm')}</p>
                                    <p><strong>Statusi i porosisë:</strong> {order.status}</p>
                                    <p><strong>Totali i porosisë:</strong> {order.total.toFixed(2)} €</p>
                                </div>
                                <button
                                    onClick={() => alert(`Details for order ${order.id}`)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Detajet e porosisë
                                </button>
                            </div>
                            <div className="flex justify-center space-x-4">
                                {order.imageUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Order ${order.id} Item ${index + 1}`}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default OrderList;