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
            <div className="Container sm:overflow-hidden lg:overflow-auto">
                {editMode ? (
                    <form onSubmit={handleSave} className="space-y-4 container w-[80%] bg-[#fdfdfd] shadow p-3">
                        {hotelInfo.image && typeof hotelInfo.image === 'string' && <img src={hotelInfo.image} alt="Hotel" className="w-[35rem] h-[20rem]" />}
                        <input type="text" name="title" value={hotelInfo.title || ''} onChange={handleInputChange} placeholder="Title" className="block w-full" />
                        <input type="text" name="subtitle" value={hotelInfo.subtitle || ''} onChange={handleInputChange} placeholder="Subtitle" className="block w-full" />
                        <textarea name="description" value={hotelInfo.description || ''} onChange={handleInputChange} placeholder="Description" className="block w-full" />
                        <input type="file" onChange={handleFileChange} className="block w-full" />
                        <button type="submit" className="btn-primary">Save</button>
                        <button type="button" onClick={handleCancelEdit} className="btn-secondary bg-red-600 p-2 mx-3">Cancel</button>
                    </form>
                ) : (
                    <div className="md:flex flex flex-col items-center justify-between container w-[80%] shadow">
                        <div className="flex-1 keen-slider w-screen md:w-[60%] 2xl:w-[580px] md:pr-5 lg:pr-6 xl:pr-8 2xl:pr-9 3xl:pr-10 md:mt-0 pl-8">
                            <img src={hotelInfo.image} alt="Hotel" className="w-[25rem] h-[20rem]" />
                        </div>
                        <div className="flex-1 font-Garamond mt-5 md:mt-0 md:pl-8 p-5 lg:pl-10 2xl:pl-14">
                            <h5 className="text-base text-khaki leading-[26px] font-medium">{hotelInfo.subtitle}</h5>
                            <h1 className="text-[22px] sm:text-2xl md:text-[21px] xl:text-3xl 2xl:text-[38px] leading-6 md:leading-7 lg:leading-[30px] 2xl:leading-[44px] text-lightBlack dark:text-white font-semibold my-4">{hotelInfo.title}</h1>
                            <p className="text-sm xl:text-base md:text-sm lg:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px]">{hotelInfo.description}</p>
                            <button onClick={() => setEditMode(true)} className="btn-primary">Edit</button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HotelBack;
