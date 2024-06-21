import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ProductList2 = () => {
    const location = useLocation();
    const category = location.state?.category;  // Accessing the state directly

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('Category:', category);
        if (category) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/products/${category}`);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProducts();
        } else {
            setLoading(false); // Set loading to false if no category is found
            console.error('No category found in location state');
        }
    }, [category]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1 className="text-3xl font-extrabold mb-4 text-gray-800">{category}</h1>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            <Link to={`/productOverView/${product.id}`} className="group" key={product.id}>
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={product.photo1_url}
                                        alt={product.product_description}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{product.product_name}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};


export default ProductList2;