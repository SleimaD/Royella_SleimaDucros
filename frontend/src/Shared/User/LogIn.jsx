import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./../../RolesRoutes/AuthProvider"; 
import { MdOutlineDoneOutline } from "react-icons/md";
import Modal from "./Modal";
import "./../../index.css"

const Login = () => {
    const { user, login } = useAuth();
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        photo: null,
        credit_card_info: '',
    });
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, photo: e.target.files[0] });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', { email: form.email, password: form.password }, {
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
                }, 1000);
            }
        } catch (err) {
            setError('Login incorrect ou problème de connexion.');
            console.error('Login error:', err.response ? err.response.data : err.message);
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== '') { 
                data.append(key, form[key]);
            }
        });

        try {
            const response = await axios.post('http://localhost:8000/api/register/', data);
            console.log('Registration successful', response.data);
            setModalMessage('Registration successful. Check your email for confirmation.');
            setShowModal(true);
        } catch (error) {
            console.error('Registration failed', error.response);
            setModalMessage('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'));
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/'); 
    };

    const toggleSignUp = () => setIsPanelActive(true);
    const toggleSignIn = () => setIsPanelActive(false);

    let containerClasses = "containerr mt-[10rem] mb-8 bg-white rounded-xl shadow-md shadow-[#858585] relative overflow-hidden w-[880px] max-[769px]:w-[750px] max-w-full min-h-[680px]";
    if (isPanelActive) {
        containerClasses += " right-panel-active";
    }

    if (user) {
        return (
            <div className="w-full bg-gray-300 flex flex-col justify-center items-center h-screen gap-3">
                <div className='flex flex-col gap-3 justify-center items-center bg-whiteSmoke p-10 px-16 '>
                    <MdOutlineDoneOutline size={80} className="text-green-400 p-2 rounded-full border-2 border-green-400 mb-10" />
                    <p className='text-2xl text-khaki font-Garamond uppercase'>Connecté(e) en tant que </p>
                    <p className='text-4xl text-khaki font-Garamond uppercase italic'>{user.username}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex justify-center items-center p-5 bg-white">
            <div className={containerClasses} id="containerr">
                <div className="form-container sign-up-container absolute top-0 h-[100%] left-0 w-[50%] opacity-0 z-[1] ">
                    <form onSubmit={handleSignUpSubmit} className='h-full bg-white flex justify-center items-center flex-col text-center p-[50px]' action="#">
                        <h1 className='font-extrabold mb-3 font-Garamond'>SIGN UP</h1>
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="text" placeholder="Username" name="username" value={form.username} onChange={handleInputChange} required />
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="email" placeholder="Email" name="email" value={form.email} onChange={handleInputChange} required />
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="text" placeholder="First Name" name="firstName" value={form.firstName} onChange={handleInputChange} required />
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="text" placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleInputChange} required />
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="password" placeholder="Password" name="password" value={form.password} onChange={handleInputChange} required />
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="text" placeholder="Credit Card Info" name="credit_card_info" value={form.credit_card_info} onChange={handleInputChange} />
                        <input className='rounded-lg p-2' type="file" name="photo" onChange={handleFileChange} />
                        <button className='bouton btn-primary mt-5 signup border-white border-2'>Sign Up</button>
                    </form>     
                </div>
                <div className="form-container sign-in-container absolute top-0 h-[100%] left-0 w-[50%] z-[2]">
                    <form onSubmit={handleLoginSubmit} className='h-full bg-white flex justify-center items-center flex-col text-center p-[50px]' action="#">
                        <h1 className='font-extrabold m-0 font-Garamond uppercase mb-3'>Sign in</h1>
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="email" placeholder="Email" name="email" value={form.email} onChange={handleInputChange} required />
                        <input className='bg-[#eee] border-none p-[15px] max-[426px]:w-[180%] m-[8px] w-[100%]' type="password" placeholder="Password" name="password" value={form.password} onChange={handleInputChange} required />
                        <button className='bouton bg-black btn-primary p-2 px-3 text-white mt-7'>Sign In</button>
                    </form>
                </div>
                <div className="overlay-container absolute top-0 left-[50%] w-[50%] h-[100%] overflow-hidden ">
                    <div className="overlay bg-mediumBlack text-white relative left-[-100%] h-[100%] w-[200%]">
                        <div className="overlay-panel overlay-left flex flex-col justify-center items-center gap-5">
                            <div className='le-logo'></div>
                            <h1 className='font-Garamond uppercase text-4xl'>Royella Hotel</h1>
                            <p className='max-[426px]:text-[0.9rem]'>Already have an account ?</p>  
                            <button onClick={toggleSignIn} className="ghost border-white p-2 px-3 mt-4 rounded-full border-2" id="signIn">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right flex flex-col justify-center items-center gap-5">
                            <div className='le-logo'></div>
                            <h1 className='font-Garamond uppercase text-4xl'>Royella Hotel</h1>
                            <button onClick={toggleSignUp}  className="ghost border-white border-2 p-2 mt-4 px-3 rounded-full" id="signUp">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} message={modalMessage} onClose={closeModal} />
        </div>
    );
};

export default Login;
