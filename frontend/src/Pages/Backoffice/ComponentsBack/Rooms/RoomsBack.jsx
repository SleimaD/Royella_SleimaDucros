import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { ImBin } from "react-icons/im";

function RoomsBack() {
    const [rooms, setRooms] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newRoom, setNewRoom] = useState({});
    const [offers, setOffers] = useState({});
    const [editingStars, setEditingStars] = useState(null);
    const [starPreview, setStarPreview] = useState(null);  

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/rooms/all_rooms/');
            setRooms(response.data);
        } catch (error) {
            console.error('Failed to fetch rooms:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSaveNewRoom = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(newRoom).forEach(key => {
            formData.append(key, newRoom[key]);
        });

        try {
            await axios.post('http://localhost:8000/api/rooms/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchRooms();
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to add room:', error.response?.data);
        }
    };

    const handleEditStars = () => {
        if (!starPreview) return;
    
        axios.patch(`http://localhost:8000/api/rooms/${starPreview.id}/`, JSON.stringify({ stars: starPreview.stars }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            fetchRooms();  
            setStarPreview(null); 
        })
        .catch(error => console.error('Failed to update stars:', error.response?.data));
    };
    
    const handleStarPreview = (room, stars) => {
        setStarPreview({ id: room.id, stars });
    };
    
    const handleDeleteRoom = (roomId) => {
        axios.delete(`http://localhost:8000/api/rooms/${roomId}/`)
            .then(() => fetchRooms())  
            .catch(error => console.error('Failed to delete room:', error));
    };
    
    const handleToggleOffers = (roomId) => {
        if (offers[roomId]) {
            setOffers(prev => ({ ...prev, [roomId]: undefined }));
        } else {
            axios.get(`http://localhost:8000/api/offers/?room=${roomId}`)
                .then(response => {
                    setOffers(prev => ({ ...prev, [roomId]: response.data }));
                })
                .catch(error => console.error('Failed to fetch offers:', error));
        }
    };

    const handleAddOffer = (roomId, discount, startDate, endDate) => {
        const offerData = {
            room_id: roomId,
            discount_percentage: discount,
            start_date: startDate,
            end_date: endDate
        };
    
        axios.post('http://localhost:8000/api/offers/', offerData)
            .then(() => handleToggleOffers(roomId)) 
            .catch(error => console.error('Failed to add offer:', error.response.data));
    };

    const handleDeleteOffer = (offerId, roomId) => {
        axios.delete(`http://localhost:8000/api/offers/${offerId}`)
            .then(() => handleToggleOffers(roomId))  
            .catch(error => console.error('Failed to delete offer:', error));
    };

    return (
        <div className='px-4 py-10 min-h-screen bg-gray-100'>
            <h1 className="text-6xl text-center font-bold mb-14 font-Garamond">ROOMS</h1>
            <button onClick={() => setIsAdding(!isAdding)} className="btn-primary text-white p-1 px-3 mb-4">
                {isAdding ? 'Cancel Adding' : 'Add New Room'}
            </button>

            {isAdding && (
                <form onSubmit={handleSaveNewRoom} className="mb-5 w-[80%] bg-whiteSmoke p-5 flex flex-wrap justify-center items-center gap-5 ">
                    <input type="text" placeholder="Name" name="name" onChange={handleInputChange} className="p-1 border-b-4 border-t-transparent border-l-transparent border-r-transparent border-black py-2 px-3 " />
                    <textarea placeholder="Description" name="description" onChange={handleInputChange} className="p-1 border-b-4 rounded-md border-black py-2 px-3 w-full h-[10rem]" />
                    <input type="text" placeholder="Price" name="price" onChange={handleInputChange} className="p-1 border-b-4 border-t-transparent border-l-transparent border-r-transparent border-black py-2 px-3 " />
                    <input type="number" placeholder="Stars" name="stars" onChange={handleInputChange} className="p-1 border-b-4 border-t-transparent border-l-transparent border-r-transparent border-black py-2 px-3 " />
                    <input type="file" name="image" onChange={handleInputChange} className="p-1  w-full" />
                    <button type="submit" className="bg-green-500 text-white p-2  mt-1">Add Room</button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 p-10">
                {rooms.map(room => (
                    <div key={room.id} className="bg-white shadow overflow-hidden group relative">
                        <div className="px-5 3xl:px-6 py-2 inline-flex bg-khaki text-sm items-center justify-center z-10 text-white absolute top-[10px] right-[10px] font-Lora font-normal leading-[26px]">
                            <span className="">${room.price}</span>
                            <span className="mx-2">|</span>
                            <span>Night</span>
                        </div>

                        <img src={room.image || '/images/placeholder.jpg'} alt={room.name} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="font-semibold text-2xl leading-tight truncate font-Garamond text-khaki">{room.name}</h3>
                            <p className="text-gray-500 line-clamp-2 mb-4">{room.description}</p>
                            <div className="flex items-center justify-between">
                                <div className='flex gap-1 items-center'>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`${i < (starPreview && starPreview.id === room.id ? starPreview.stars : room.stars) ? 'text-yellow-400' : 'text-gray-400'} cursor-pointer`}
                                        onClick={() => handleStarPreview(room, i + 1)}
                                    />
                                ))}
                                </div>
                                {starPreview && starPreview.id === room.id && (
                                    <button onClick={handleEditStars} className="ml-2 text-sm bg-khaki text-white p-1 rounded">Save</button>
                                )}
                                <button onClick={() => handleDeleteRoom(room.id)} className="text-red-500 text-lg p-1 rounded"><ImBin /></button>
                            </div>
                            <button onClick={() => handleToggleOffers(room.id)} className="mt-3 bg-green-500 text-white p-1 ">
                                {offers[room.id] ? 'Hide Offers' : 'Show Offers'}
                            </button>
                            {offers[room.id] && (
                                <div className="mt-2">
                                    {offers[room.id].map(offer => (
                                        <div key={offer.id} className="flex justify-between items-center p-1">
                                            <span>Discount: {offer.discount_percentage}%</span>
                                            <button onClick={() => handleDeleteOffer(offer.id, room.id)} className="bg-red-500 text-white p-1 rounded ml-1">Delete</button>
                                        </div>
                                    ))}
                                    <form  className="w-[80%] flex flex-col gap-5 mt-5 " onSubmit={(e) => {
                                        e.preventDefault();
                                        const discount = e.target.discount.value;
                                        const startDate = e.target.start_date.value;
                                        const endDate = e.target.end_date.value;
                                        handleAddOffer(room.id, discount, startDate, endDate);
                                        e.target.reset();
                                    }}>
                                        <input type="number" name="discount" placeholder="New Offer %" className="p-1 border-2 rounded" />
                                        <input type="date" name="start_date" placeholder="Start Date" className="p-1 border-2 rounded ml-2" />
                                        <input type="date" name="end_date" placeholder="End Date" className="p-1 border-2 rounded ml-2" />
                                        <button type="submit" className="bg-blue-500 text-white p-1  ml-2">Add Offer</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RoomsBack;
