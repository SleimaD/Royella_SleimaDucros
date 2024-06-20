import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'keen-slider/keen-slider.min.css';

const HotelBack = () => {
    const [hotelInfo, setHotelInfo] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchHotelInfo();
    }, []);

    const fetchHotelInfo = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/hotels/1/');
            setHotelInfo(response.data);
        } catch (error) {
            console.error('Error fetching hotel info:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHotelInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setHotelInfo((prev) => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleCancelEdit = () => {
        fetchHotelInfo();
        setEditMode(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(hotelInfo).forEach(key => {
            if (key === 'image' && hotelInfo[key] instanceof File) {
                formData.append('image', hotelInfo[key], hotelInfo[key].name);
            } else if (key !== 'image') {
                formData.append(key, hotelInfo[key]);
            }
        });

        try {
            await axios.patch(`http://127.0.0.1:8000/api/hotels/1/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchHotelInfo();
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update hotel info', error);
        }
    };

    if (!hotelInfo) return <div>Loading...</div>;

    return (
        <section className="dark:bg-mediumBlack py-20 2xl:py-[120px]">
            <h3 className='text-2xl font-Garamond uppercase underline p-2 text-center mt-3 mb-5'>Hotel</h3>
            <div className="Container  w sm:overflow-hidden lg:overflow-auto">
                {editMode ? (
                    <form onSubmit={handleSave} className="space-y-4 container w-[80%] bg-whiteSmoke shadow p-3 flex flex-wrap justify-center  gap-5">
                    
                        {hotelInfo.image && typeof hotelInfo.image === 'string' && <img src={hotelInfo.image} alt="Hotel" className="w-full h-[25rem]" />}
                        <input type="text" name="title" value={hotelInfo.title || ''} onChange={handleInputChange} placeholder="Title" className="block w-[25rem] border-t-transparent border-l-transparent border-r-transparent border-b-4 rounded-lg border-black bg-[#ffffffd2] " />
                        <input type="text" name="subtitle" value={hotelInfo.subtitle || ''} onChange={handleInputChange} placeholder="Subtitle" className="block w-[25rem] border-t-transparent border-l-transparent border-r-transparent border-b-4 rounded-lg border-black bg-[#ffffffcf]" />
                        <textarea name="description" value={hotelInfo.description || ''} onChange={handleInputChange} placeholder="Description" className="block w-[45rem] h-[10rem] border-2 border-[#c1c0c0] rounded-lg  bg-[#ffffff5c]" />
                        <input type="file" onChange={handleFileChange} className="block  " />
                        <button type="submit" className="btn-primary">Save</button>
                        <button type="button" onClick={handleCancelEdit} className="btn-secondary bg-red-600 p-2 mx-3">Cancel</button>
                    </form>
                ) : (
                    <div className="md:flex flex  items-center justify-between container mt-[-5rem] w-[85%] shadow p-3 bg-whiteSmoke transition-all duration-300">
                        <div className="flex  w-[50%]">
                            <img src={hotelInfo.image} alt="Hotel" className="w-full h-[34rem]" />
                        </div>
                        <div className="flex-1 font-Garamond mt-5 md:mt-0 md:pl-8 p-5 lg:pl-10 2xl:pl-14">
                            <h5 className="text-base text-khaki leading-[26px] font-medium">{hotelInfo.subtitle}</h5>
                            <h1 className="text-[22px] sm:text-2xl md:text-[21px] xl:text-3xl 2xl:text-[38px] leading-6 md:leading-7 lg:leading-[30px] 2xl:leading-[44px] text-lightBlack dark:text-white font-semibold my-4">{hotelInfo.title}</h1>
                            <p className="text-sm xl:text-base md:text-sm lg:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px]">{hotelInfo.description}</p>
                            <button onClick={() => setEditMode(true)} className="btn-primary transition-all duration-300">Edit</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HotelBack;
