
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./../../RolesRoutes/AuthProvider";
import { FaStar } from "react-icons/fa";
import { MdOutlineBedroomParent } from "react-icons/md";

const Reservations = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [pendingReservations, setPendingReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchRoomDetails = async (roomId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching details for room ${roomId}:`, error);
            return null;
        }
    };

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/bookings/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const reservationsWithRoomDetails = await Promise.all(response.data.map(async reservation => {
                const roomDetails = await fetchRoomDetails(reservation.room);
                return {
                    ...reservation,
                    roomDetails
                };
            }));

            console.log(reservationsWithRoomDetails); 
            setReservations(reservationsWithRoomDetails);

            if (user.role.toLowerCase() === 'receptionist' || user.role.toLowerCase() === 'admin') {
                const pending = reservationsWithRoomDetails.filter(reservation => reservation.status === 'PENDING');
                setPendingReservations(pending);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
                status: 'CONFIRMED'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            fetchReservations();
        } catch (error) {
            console.error('Error approving reservation:', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
                status: 'CANCELLED'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            fetchReservations();
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    const renderTable = (title, data, showActions) => (
        <div className='w-full flex justify-center items-center mb-16'>
            <div className="w-[80%]">
                <h1 className='text-5xl font-Garamond uppercase text-center p-2 mt-5 mb-8'>{title}</h1>
                <table className="w-full text-sm text-left text-gray-500 p-3">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr className='bg-khaki text-white'>   
                            <th scope="col" className="py-3 px-6 font-Garamond text-xl">Room</th>
                            <th scope="col" className="py-3 px-6 font-Garamond text-xl">Date</th>
                            <th scope="col" className="py-3 px-6 font-Garamond text-xl">Status</th>
                            {showActions && <th scope="col" className="py-3 px-6 font-Garamond text-xl">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(reservation => (
                            <tr key={reservation.id} className={`bg-white border-b border-[#d6d6d6a9] ${reservation.status === 'PENDING' || reservation.status === 'CANCELLED' ? ' bg-[#f5f4f4d7]' : ''}`}>
                                <td className="py-4 px-6 flex items-center gap-4 font-Garamond text-lg ">
                                    <MdOutlineBedroomParent size={30} className="text-khaki" />
                                    {reservation.roomDetails ? reservation.roomDetails.name : 'Loading...'}
                                </td>
                                <td className="py-4 px-6 font-Garamond text-lg ">
                                    from {reservation.start_date} to {reservation.end_date}
                                </td>
                                <td className={`py-4 px-6 font-Garamond text-lg ${reservation.status === 'PENDING' || reservation.status === 'CANCELLED' ? 'text-red-500' : 'text-green-500 font-semibold'}`}>
                                    {reservation.status}
                                </td>
                                {showActions && (
                                    <td className="py-4 px-6">
                                        <button
                                            onClick={() => handleApprove(reservation.id)}
                                            className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleCancel(reservation.id)}
                                            className="bg-red-500 text-white py-2 px-4 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (user.role.toLowerCase() === 'receptionist' || user.role.toLowerCase() === 'admin') {
        return (
            <div>
                {renderTable('Pending Reservations', pendingReservations, true)}
                {renderTable('All Reservations', reservations, false)}
            </div>
        );
    }

    return (
        <div>
            {reservations.length ? (
                renderTable('Reservations', reservations, false)
            ) : (
                <p className="text-center text-gray-500 font-Garamond text-xl">You have no reservations at the moment.</p>
            )}  
        </div>
    );
};

export default Reservations;
