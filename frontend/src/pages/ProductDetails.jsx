import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import api from '../utils/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Product not found');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        addToCart(product, Number(qty));
        navigate('/cart');
    };

    if (loading) return <div className="loader"></div>;
    if (error) return <div className="alert alert-danger mt-8">{error}</div>;

    return (
        <div className="mt-4">
            <Link to="/" className="btn btn-outline mb-8">
                Go Back
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Image Section */}
                <div className="md:col-span-1">
                    <div className="card h-full flex items-center justify-center p-4 bg-white" style={{ minHeight: '300px' }}>
                        <img
                            src={product?.image}
                            alt={product?.name}
                            className="w-full h-auto object-contain max-h-96"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-secondary p-8 text-center border-2 border-dashed border-gray-300 w-full h-full flex items-center justify-center rounded">Image Placeholder</span>'; }}
                        />
                    </div>
                </div>

                {/* Details Section */}
                <div className="md:col-span-1">
                    <h1 className="text-3xl mb-4 font-extrabold text-primary">{product?.name}</h1>
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <span className="badge mr-2">{product?.brand}</span>
                        <span className="text-secondary text-sm">Category: {product?.category}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        {product?.description}
                    </p>
                </div>

                {/* Status/Action Card */}
                <div className="md:col-span-1">
                    <div className="card p-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                            <span className="text-secondary font-medium">Price:</span>
                            <span className="text-2xl font-bold">${product?.price}</span>
                        </div>

                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                            <span className="text-secondary font-medium">Status:</span>
                            <span className={`font-bold ${product?.countInStock > 0 ? 'text-success' : 'text-danger'}`}>
                                {product?.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                            </span>
                        </div>

                        {product?.countInStock > 0 && (
                            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                                <span className="text-secondary font-medium">Qty:</span>
                                <select
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className="form-control"
                                    style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
                                >
                                    {[...Array(product.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-block mt-4 py-3 text-lg"
                            disabled={product?.countInStock === 0}
                            onClick={addToCartHandler}
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
