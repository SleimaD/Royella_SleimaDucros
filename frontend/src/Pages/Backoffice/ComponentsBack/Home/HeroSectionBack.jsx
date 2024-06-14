import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaStar } from "react-icons/fa";

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
        <div className="container mx-auto px-4 py-8 flex justify-center items-center gap-3 flex-wrap">
            {banners.sort((a, b) => a.order - b.order).map((banner) => (
                <div key={banner.id} className="mb-4 p-4 shadow rounded  w-[30rem]">
                    {editingId === banner.id ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave(banner.id);
                        }}className="space-y-4">
                            <input type="text" value={banner.title} onChange={e => handleChange(banner.id, 'title', e.target.value)} className="block w-full" />
                            <input type="number" value={banner.stars} onChange={e => handleChange(banner.id, 'stars', parseInt(e.target.value, 10))} className="block w-full" />
                            <input type="number" value={banner.order} onChange={e => handleChange(banner.id, 'order', parseInt(e.target.value, 10))} className="block w-full" />
                            <input type="file" onChange={e => handleFileChange(banner.id, e.target.files)} className="block w-full" />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                            <button type="button" onClick={() => setEditingId(null)} className="ml-2 bg-red-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        </form>
                    ) : (
                        <div>
                            <div className='flex  gap-2 '>
                                <div className='w-[50%]'>
                                {banner.image && <img src={banner.image} alt="Banner" className="w-full h-32 object-cover" />}
                                </div>
                                <div>
                                    <h3>{banner.title}</h3>
                                    <p>Stars: {banner.stars}</p>
                                    <p>Order: {banner.order}</p>
                                    <button onClick={() => handleEdit(banner.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all duration-300">Edit</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HeroSectionBack;
