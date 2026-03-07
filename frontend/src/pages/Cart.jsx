import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import CartContext from '../context/CartContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart, cartCount, cartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const checkoutHandler = () => {
        navigate('/login?redirect=checkout');
    };

    return (
        <div className="mt-8">
            <h1 className="text-3xl mb-8 font-extrabold">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is waiting to be filled."
                    description="Discover trending electronics, fashion, and daily groceries handpicked for you."
                    buttonText="Start Exploring"
                    buttonLink="/"
                    colorHint="rgba(236, 72, 153, 0.2)"
                />
            ) : (
                <div className="grid lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {cartItems.map((item) => (
                            <div key={item.product} className="card p-4 mb-4 flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-xs text-secondary">Image</span>'; }}
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <Link to={`/product/${item.product}`} className="font-bold text-lg hover:text-primary transition-colors">
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="text-xl font-bold text-primary w-24 text-center">
                                    ${item.price.toFixed(2)}
                                </div>
                                <div className="w-24">
                                    <select
                                        value={item.qty}
                                        onChange={(e) => addToCart(item, Number(e.target.value) - item.qty)}
                                        className="form-control"
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    className="btn btn-outline text-danger hover:bg-danger hover:text-white border-danger w-12 h-12 flex items-center justify-center p-0"
                                    onClick={() => removeFromCart(item.product)}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-2xl mb-4 border-b pb-4">Order Summary</h2>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-secondary text-lg">Subtotal ({cartCount} items)</span>
                                <span className="text-2xl font-bold">${cartTotal}</span>
                            </div>
                            <button
                                className="btn btn-primary btn-block py-3 text-lg font-bold"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
