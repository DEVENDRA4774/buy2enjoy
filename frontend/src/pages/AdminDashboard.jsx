import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import SocketContext from '../context/SocketContext';
import api from '../utils/api';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } };
                // Fetch orders directly, skipping Auth header as cookie is http-only
                const [ordersRes, productsRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products')
                ]);
                setOrders(ordersRes.data);
                setProducts(productsRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    useEffect(() => {
        if (socket) {
            socket.on('newOrder', (order) => {
                setOrders((prev) => [order, ...prev]);
            });
        }
        return () => {
            if (socket) socket.off('newOrder');
        };
    }, [socket]);

    const deliverOrderHandler = async (id) => {
        try {
            await api.put(`/orders/${id}/deliver`);
            setOrders(orders.map((o) => (o._id === id ? { ...o, isDelivered: true, status: 'Delivered', deliveredAt: new Date().toISOString() } : o)));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="loader"></div>;

    return (
        <div className="mt-8">
            <h1 className="text-3xl font-extrabold mb-8">Admin Dashboard</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Orders Section */}
                <div className="card p-6">
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-secondary">
                                    <th className="py-2">ID</th>
                                    <th className="py-2">USER</th>
                                    <th className="py-2">TOTAL</th>
                                    <th className="py-2">STATUS</th>
                                    <th className="py-2">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-secondary">No orders found.</td>
                                    </tr>
                                ) : (
                                    orders.slice(0, 10).map((order) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-3 text-sm">{order._id.substring(0, 8)}</td>
                                            <td className="py-3 text-sm">{order.user?.name || 'Unknown'}</td>
                                            <td className="py-3 font-bold">${order.totalPrice.toFixed(2)}</td>
                                            <td className="py-3">
                                                <span className={`badge ${order.isDelivered ? 'badge-success' : 'bg-yellow-500'}`}>
                                                    {order.isDelivered ? 'Delivered' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                {!order.isDelivered && (
                                                    <button
                                                        className="btn btn-outline border-success text-success py-1 px-2 text-xs"
                                                        onClick={() => deliverOrderHandler(order._id)}
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Products Section */}
                <div className="card p-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <h2 className="text-2xl font-bold">Products List</h2>
                        <button className="btn btn-primary py-1 px-3 text-sm">
                            + Create
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-secondary">
                                    <th className="py-2">ID</th>
                                    <th className="py-2">NAME</th>
                                    <th className="py-2">PRICE</th>
                                    <th className="py-2">STOCK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-secondary">No products found.</td>
                                    </tr>
                                ) : (
                                    products.slice(0, 10).map((product) => (
                                        <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="py-3 text-sm">{product._id.substring(0, 8)}</td>
                                            <td className="py-3 text-sm">{product.name}</td>
                                            <td className="py-3 font-bold">${product.price.toFixed(2)}</td>
                                            <td className="py-3">
                                                <span className={`text-sm ${product.countInStock > 0 ? 'text-success font-bold' : 'text-danger'}`}>
                                                    {product.countInStock}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
