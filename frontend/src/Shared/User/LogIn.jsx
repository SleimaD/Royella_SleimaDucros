import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:8000/api/login/', { username, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
          });
            localStorage.setItem('refreshToken', response.data.refresh);
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('role', response.data.user.role); 
            console.log('Login successful', response.data);
            // navigate('/')
            // window.location.reload()
          } catch (err) {
            setError('LogIn pas bon');
            console.error('Login error:', err.response ? err.response.data : err.message);
        }
    };

     

  

    return (
        <div className="w-full bg-gray-300 flex flex-col justify-center items-center h-screen gap-3">
            <div className='flex justify-center items-center'>
                <p className=' text-4xl '>Log</p>
                <p className='bg-khaki text-white  px-1 rounded-sm text-4xl'>In</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-6">Login</h2>
                {error && <p className="text-khaki">{error}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input 
                        type="text" 
                        className="mt-1 p-2 w-full border rounded" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
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
                    <button type="submit" className=" bg-khaki text-white py-2  px-6 rounded   ">Login</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
