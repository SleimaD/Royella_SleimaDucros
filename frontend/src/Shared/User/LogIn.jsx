import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./../../RolesRoutes/AuthProvider"; 

const Login = () => {
    const { user, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data) {
                const userData = {
                    ...response.data.user,
                    accessToken: response.data.access,
                    refreshToken: response.data.refresh
                };
                login(userData);
                localStorage.setItem('user', JSON.stringify(userData)); 
                window.location.reload();
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            setError('Login incorrect ou problème de connexion.');
            console.error('Login error:', err.response ? err.response.data : err.message);
        }
    };

    if (user) {
        return (
            <div className="w-full bg-gray-300 flex flex-col justify-center items-center h-screen gap-3">
                <div className='flex justify-center items-center'>
                    <p className='text-4xl text-khaki'>Connecté(e) en tant que {user.username}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-300 flex flex-col justify-center items-center h-screen gap-3">
            <div className='flex justify-center items-center'>
                <p className='text-4xl'>Log</p>
                <p className='bg-khaki text-white px-1 rounded-sm text-4xl'>In</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-6">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input 
                        type="email" 
                        className="mt-1 p-2 w-full border rounded" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input 
                        type="password" 
                        className="mt-1 p-2 w-full border rounded" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div className='flex justify-center items-center'>
                    <button type="submit" className="bg-khaki text-white py-2 px-6 rounded">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
