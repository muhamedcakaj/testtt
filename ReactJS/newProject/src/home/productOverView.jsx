import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductOverview = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [addToCartError, setAddToCartError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [username, setUserName] = useState('');


    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserName(payload.sub);
        }
    }, []);


    const fetchCartItems = async () => {
        const token = sessionStorage.getItem('jwtToken');
        try {
            const response = await axios.get('http://localhost:8080/shoppingCart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const fetchWishlist = async () => {
        const token = sessionStorage.getItem('jwtToken');
        try {
            const response = await axios.get('http://localhost:8080/wishList', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setWishlist(response.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/products/id/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };
    const fetchRelatedProducts = async () => {
        try {
            if (product) {
                const response = await axios.get(`http://localhost:8080/products/${product.category}`);
                setRelatedProducts(response.data.filter(item => item.id !== product.id)); // Exclude the current product
            }
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    };

    useEffect(() => {
        fetchRelatedProducts();
    }, [product]);

    useEffect(() => {
        fetchProduct();
        fetchCartItems();
        fetchWishlist();
        fetchRelatedProducts();
    }, [id]);

    useEffect(() => {
        const handlePageFocus = () => {
            fetchCartItems();
        };
        window.addEventListener('focus', handlePageFocus);

        return () => {
            window.removeEventListener('focus', handlePageFocus);
        };
    }, []);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async (event) => {
        event.preventDefault();
        setIsAddingToCart(true);
        setAddToCartError(null);

        try {
            // Check if the product is already in the cart
            const existingCartItem = cartItems.find(
                (item) => item.id_of_product === product.id && item.username_of_user === username
            );

            // Fetch product details if it's not already fetched
            if (!product) {
                await fetchProduct();
            }

            // Check if the product quantity is sufficient
            if (product.quantity < quantity) {
                setAddToCartError(`The product doesn't have that much stock. Available stock: ${product.quantity}`);
                setIsAddingToCart(false);
                return;
            }

            // If the product is in the cart, update the quantity
            if (existingCartItem) {
                const token = sessionStorage.getItem('jwtToken');
                const updatedQuantity = quantity;
                await axios.put(`http://localhost:8080/shoppingCart/${existingCartItem.id}`,
                    {
                        quantity: updatedQuantity
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
            } else {
                // Otherwise, add the product to the cart
                const shoppingCartEntity = {
                    id_of_product: product.id,
                    username_of_user: username,
                    quantity: quantity,
                };
                const token = sessionStorage.getItem('jwtToken');
                await axios.post('http://localhost:8080/shoppingCart', shoppingCartEntity, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            await fetchCartItems();
        } catch (error) {
            setAddToCartError('Error adding to cart');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleWishlistToggle = async () => {
        setIsWishlistLoading(true);

        try {
            const token = sessionStorage.getItem('jwtToken');
            // Toggle product in wishlist
            // Add or remove product from wishlist based on its current state
            const existingWishlistItem = wishlist.find(
                (item) => item.id_of_product === product.id && item.username_of_user === username
            );

            if (existingWishlistItem) {
                await axios.delete(`http://localhost:8080/wishList/${existingWishlistItem.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setWishlist(wishlist.filter(item => item.id_of_product !== product.id));
            } else {
                const wishlistEntity = {
                    id_of_product: product.id,
                    username_of_user: username,
                };
                const response = await axios.post('http://localhost:8080/wishList', wishlistEntity, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setWishlist([...wishlist, response.data]);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    const isProductInWishlist = wishlist.some(item => item.id_of_product === product.id && item.username_of_user === username);


    return (
        <div className="bg-white">
            <div className="pt-6">
                {/* Product Images and Details */}
                <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                    <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
                        <img
                            src={product.photo1_url}
                            alt={product.product_description}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                    <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                            <img
                                src={product.photo4_url}
                                alt={product.product_description}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                            <img
                                src={product.photo3_url}
                                alt={product.product_description}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                    </div>
                    <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                        <img
                            src={product.photo2_url}
                            alt={product.product_description}
                            className="h-full w-full object-cover object-center"
                        />
                    </div>
                </div>

                <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                    <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.product_name}</h1>
                    </div>

                    <div className="mt-4 lg:row-span-3 lg:mt-0">
                        <h2 className="sr-only">Product information</h2>
                        <p className="text-3xl tracking-tight text-gray-900">${product.price}</p>

                        <div className="mt-6">
                            <h3 className="sr-only">Reviews</h3>
                            <div className="flex items-center">
                                <div className="flex items-center">
                                    {[...Array(4)].map((_, i) => (
                                        <svg key={i} className="text-gray-900 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                    <svg className="text-gray-200 h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="sr-only">4 out of 5 stars</p>
                                <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">117 reviews</a>
                            </div>
                        </div>

                        <form className="mt-10" onSubmit={handleAddToCart}>
                            <div className="flex items-center mb-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-2">
                                    Quantity:
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white ${isAddingToCart ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                disabled={isAddingToCart}
                            >
                                {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                            </button>
                        </form>
                        {addToCartError && <p className="mt-2 text-sm text-red-600">{addToCartError}</p>}
                        <button
                            onClick={handleWishlistToggle}
                            className={`mt-4 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white ${isProductInWishlist ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                            disabled={isWishlistLoading}
                        >
                            {isWishlistLoading ? 'Updating Wishlist...' : isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>

                    <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
                        <div>
                            <h3 className="sr-only">Description</h3>

                            <div className="space-y-6">
                                <p className="text-base text-gray-900">{product.product_description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-medium text-gray-900">Informacione rreth produktit</h3>

                            <div className="mt-4">
                                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                                    <li className="text-gray-400">
                                        <span className="text-gray-600">Prodhuesi: {product.prodhuesi}</span>
                                    </li>
                                    <li className="text-gray-400">
                                        <span className="text-gray-600">Garancioni: {product.garancioni}</span>
                                    </li>
                                    <li className="text-gray-400">
                                        <span className="text-gray-600">Vend i Prodhimit: {product.vend_iprodhimit}</span>
                                    </li>
                                    <li className="text-gray-400">
                                        <span className="text-gray-600">Pesha(g): {product.pesha}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-sm font-medium text-gray-900">Details</h2>

                            <div className="mt-4 space-y-6">
                                <p className="text-sm text-gray-600">{product.product_description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <h2 className="text-lg font-medium text-gray-900">You may also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                    {relatedProducts.map(relatedProduct => (
                        <a href={`/productOverView/${relatedProduct.id}`} className="group" key={relatedProduct.id}>
                            <div className="bg-white shadow-md rounded-lg p-4">
                                {/* Render related product details */}
                                <img src={relatedProduct.photo1_url} alt={relatedProduct.product_description} className="w-full h-48 object-cover mb-4" />
                                <p className="text-sm text-gray-900">{relatedProduct.product_name}</p>
                                <p className="text-sm text-gray-500">${relatedProduct.price}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductOverview;