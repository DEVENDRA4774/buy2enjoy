import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(email, password);
        if (!res.success) {
            setError(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center mt-8" style={{ minHeight: '60vh' }}>
            <div className="card max-w-md w-full p-8" style={{ padding: '2rem' }}>
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block py-2">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary">
                    New Customer?{' '}
                    <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="font-bold">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
