import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar } from "react-icons/fa";
import { TfiInfoAlt } from "react-icons/tfi";
import { IoStar } from "react-icons/io5";


const HeroSectionBack = () => {
    const [banners, setBanners] = useState([]);
    const [editingId, setEditingId] = useState(null); 

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/home-banners/');
            setBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleSave = async (id) => {
        const formData = new FormData();
        const banner = banners.find(b => b.id === id);

        formData.append('title', banner.title);
        formData.append('stars', banner.stars);
        formData.append('order', banner.order);
        if (typeof banner.image === 'object') {
            formData.append('image', banner.image, banner.image.name);
        } else {
            formData.append('image', banner.image);
        }

        if (banner.image && banner.image instanceof File) {
            formData.append('image', banner.image, banner.image.name);
        }

        try {
            await axios.patch(`http://127.0.0.1:8000/api/home-banners/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchBanners();
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update banner', error);
        }
    };

    const handleChange = (id, field, value) => {
        const updatedBanners = banners.map(b => {
            if (b.id === id) {
                return { ...b, [field]: value };
            }
            return b;
        });
        setBanners(updatedBanners);
    };

    const handleFileChange = (id, file) => {
        handleChange(id, 'image', file[0]);
    };

    return (
        <div className=" w-full p-3">
        <h3 className='text-2xl font-Garamond uppercase underline p-2 text-center mt-3 mb-5'>home-banners</h3>

        <div className='container mx-auto px-4 py-8 flex justify-center items-center gap-3 flex-wrap bg-whiteSmoke'>
            {banners.sort((a, b) => a.order - b.order).map((banner) => (
                    <div key={banner.id} className="mb-4 p-4  rounded  w-[30rem] bg-transparent">
                        {editingId === banner.id ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSave(banner.id);
                            }} className="space-y-4">
                                <input type="text" value={banner.title} onChange={e => handleChange(banner.id, 'title', e.target.value)} className="block w-full" />
                                <input type="number" value={banner.stars} onChange={e => handleChange(banner.id, 'stars', parseInt(e.target.value, 10))} className="block w-full" />
                                <input type="number" value={banner.order} onChange={e => handleChange(banner.id, 'order', parseInt(e.target.value, 10))} className="block w-full" />
                                <input type="file" onChange={e => handleFileChange(banner.id, e.target.files)} className="block w-full" />
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                                <button type="button" onClick={() => setEditingId(null)} className="ml-2 bg-red-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                            </form>
                        ) : (
                            <div>
                                <div className="relative flex h-[22em] w-[28em] items-center justify-center rounded-[1.5em] border-[0.2px] border-[#ada9b147] bg-[rgba(107,33,168,0.11)]  text-lime-300 overflow-hidden ">
                                    <div className="group absolute left-1/2 top-1/2 flex h-[4em] w-[4em] -translate-x-1/2 -translate-y-1/2 items-center p-3 justify-center overflow-hidden rounded-[1.5em] border-[1px] border-[#ffffffaa] bg-[#8988888e] backdrop-blur-[8px] duration-[500ms] hover:h-[20em] hover:w-[26em] hover:rounded-[1.5em]" >
                                        <div><TfiInfoAlt size={30} className="text-white" /></div>
                                        <div className="items-left duration-600 absolute left-0 top-0 flex h-[10em] w-[16em] translate-y-[100%] flex-col justify-between p-[1.5em] font-nunito text-[hsl(0,0%,85%)] group-hover:translate-y-0 gap-5">
                                        <div className="items-left w-full flex flex-col gap-5 justify-center">
                                            <h1 className="text-[1.5em] font-bold ">{banner.title}</h1>
                                            <p className='flex gap-2'>
                                                {[...Array(5)].map((_, i) => (
                                                    <IoStar key={i}
                                                        className="text-[#e9a827]"
                                                    />
                                                ))}
                                            </p>
                                            <p>Order: {banner.order}</p>
                                            <button onClick={() => handleEdit(banner.id)} className=" text-white font-bold rounded transition-all duration-300  btn-primary">Edit</button>
                                        </div>
                                        </div>
                                    </div>
                                    {banner.image && <img src={banner.image} alt="Banner" className="w-full h-full object-cover" />}
                                    </div>

                            </div>
                        )}
                    </div>
                ))}
        </div>

        </div>
    );
};

export default HeroSectionBack;
