import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./../../RolesRoutes/AuthProvider";

const Reservations = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [pendingReservations, setPendingReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/bookings/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReservations(response.data);
            if (user.role.toLowerCase() === 'receptionist') {
                const pending = response.data.filter(reservation => reservation.status === 'PENDING');
                setPendingReservations(pending);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const handleNewBooking = async (room, startDate, endDate) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/bookings/', {
                room,
                start_date: startDate,
                end_date: endDate,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Booking successful, waiting for confirmation.');
            fetchReservations();
        } catch (error) {
            if (error.response.status === 400) {
                alert(error.response.data.error);
                navigate('/profile');
            } else {
                console.error('Error making a booking:', error);
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
                status: 'CONFIRMED'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchReservations();
        } catch (error) {
            console.error('Error cancelling reservation:', error);
        }
    };

    if (user.role.toLowerCase() === 'receptionist') {
        return (
            <div>
                <h1>Pending Reservations</h1>
                {pendingReservations.length ? (
                    <ul>
                        {pendingReservations.map(reservation => (
                            <li key={reservation.id}>
                                {reservation.room} from {reservation.start_date} to {reservation.end_date} - Status: {reservation.status}
                                <button onClick={() => handleApprove(reservation.id)}>Approve</button>
                                <button onClick={() => handleCancel(reservation.id)}>Cancel</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No pending reservations at the moment.</p>
                )}

                <h1>All Reservations</h1>
                {reservations.length ? (
                    <ul>
                        {reservations.map(reservation => (
                            <li key={reservation.id}>{reservation.room} from {reservation.start_date} to {reservation.end_date} - Status: {reservation.status}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No reservations at the moment.</p>
                )}
            </div>
        );
    }


    return (
        <div>
            <h1>Your Reservations</h1>
            {reservations.length ? (
                <ul>
                    {reservations.map(reservation => (
                        <li key={reservation.id}>{reservation.room} from {reservation.start_date} to {reservation.end_date} - Status: {reservation.status}</li>
                    ))}
                </ul>
            ) : (
                <p>You have no reservations at the moment.</p>
            )}  
        </div>
    );
};

export default Reservations;
