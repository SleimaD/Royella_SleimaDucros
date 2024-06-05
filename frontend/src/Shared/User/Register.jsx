import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        photo: null,
        credit_card_info: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                [name]: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== '') { 
                data.append(key, formData[key]);
            }
        });

        console.log([...data.entries()]); 

        try {
            const response = await axios.post('http://localhost:8000/api/register/', data);
            console.log('Registration successful', response.data);
            alert('Registration successful. Check your email for confirmation.');
        } catch (error) {
            console.error('Registration failed', error.response);
            alert('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    return (
        <div className='p-10 mt-3 mb-3 flex justify-center items-center w-full h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-5 w-[50rem] bg-[#ffffff] p-5 py-10 rounded-lg shadow-lg'>
                <h1 className='text-2xl font-bold text-center'>Register</h1>
                <div className='flex flex-wrap gap-5 justify-center items-center'>
                    <input className='px-6 rounded-lg' type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                    <input className='px-6 rounded-lg' type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                    <input className='px-6 rounded-lg' type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                    <input className='px-6 rounded-lg' type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                    <input className='px-6 rounded-lg' type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                    <input className='px-6 rounded-lg' type="text" name="credit_card_info" value={formData.credit_card_info} onChange={handleChange} placeholder="Credit Card Info"  />
                    <input className=' rounded-lg' type="file" name="photo" onChange={handleChange} />
                </div>
                <button type="submit" className='bg-khaki p-1 px-3 text-white rounded-lg text-lg'>Register</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
