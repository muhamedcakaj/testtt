import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/orders/id/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                console.error('Error fetching order:', error);
            });
    }, [orderId]); // Fetch order details whenever orderId changes

    if (!order) {
        return <p>Loading...</p>; // Display a loading message while fetching data
    }
    return (
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
            <div className="flex justify-start item-start space-y-2 flex-col">
                <h1 className="text-3xl dark:text-black lg:text-4xl font-semibold leading-7 lg:leading-9 text-black-800">#{order.id}</h1>
                <p className="text-base dark:text-black-300 font-medium leading-6 text-gray-600">{moment(order.created_at).format('YYYY-MM-DD - HH:mm')}</p>
            </div>
            <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Shporta e Klientit</p>
                        {order.order_items.map(item => (
                            <div key={item.id} className="flex justify-between items-center dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 mb-4">
                                <div className="flex items-center space-x-4 flex-grow">
                                    <img className="w-16 h-16 object-cover" src={item.product.photo1_url} alt={item.product_name} />
                                    <div>
                                        <h3 className="text-lg dark:text-white font-semibold leading-6 text-gray-800">Emri: {item.product.product_name}</h3>
                                        <p className="text-sm dark:text-gray-300 leading-none text-gray-800">Prodhuesi: {item.product.prodhuesi}</p>
                                        <p className="text-sm dark:text-gray-300 leading-none text-gray-800">Vend i Prodhimit: {item.product.vend_iprodhimit}</p>
                                        <p className="text-sm dark:text-gray-300 leading-none text-gray-800">Garancioni: {item.product.garancioni}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center space-x-14 ml-auto">
                                    <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">{item.quantity}</p>
                                    <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">x</p>
                                    <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800 font-semibold">${(item.product.price).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shuma:</h3>
                            <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">



                            </div>
                            <div className="flex justify-between items-center w-full">
                                <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Totali</p>
                                <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">${order.total}</p>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Statusi:</h3>
                            <div className="flex justify-between items-start w-full">
                                <div className="flex justify-center items-center space-x-4">
                                </div>
                            </div>
                            <div className="w-full flex justify-center items-center">
                                <button className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">{order.status}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                    <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Klienti</h3>
                    <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                        <div className="flex flex-col justify-start items-start flex-shrink-0">
                            <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">

                                <div className="flex justify-start items-start flex-col space-y-2">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">{order.user.name + " " + order.user.surname}</p>
                                </div>
                            </div>
                            <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                                <img className="dark:hidden" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1.svg" alt="email" />
                                <img className="hidden dark:block" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1dark.svg" alt="email" />
                                <p className="cursor-pointer text-sm leading-5">{order.user.user_email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                            <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                                <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Menyra e Transportit</p>
                                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{order.type_of_transport}</p>
                                </div>
                                <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Adresa e Porosisë</p>
                                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">Shteti : {order.country}</p>
                                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">Qyteti : {order.city}</p>
                                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">Adresa : {order.address}</p>
                                </div>
                            </div>
                            <div className="flex w-full justify-center items-center md:justify-start md:items-start">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;