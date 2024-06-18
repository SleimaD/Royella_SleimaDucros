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
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
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


    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await axios.patch(`http://127.0.0.1:8000/api/bookings/${id}/`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (response.status === 200) {
                alert(`Reservation ${newStatus.toLowerCase()}.`);
                fetchReservations();  
            }
        } catch (error) {
            console.error(`Error updating reservation status: ${error}`);
            alert('Failed to update the reservation status.');
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
                                {reservation.room.name} from {reservation.start_date} to {reservation.end_date} - Status: {reservation.status}
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
                            <li key={reservation.id}>{reservation.room.name} from {reservation.start_date} to {reservation.end_date} - Status: {reservation.status}</li>
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
                        <li key={reservation.id}>{reservation.room.name} from {reservation.start_date} to {reservation.end_date} - Status: {reservation.status}</li>
                    ))}
                </ul>
            ) : (
                <p>You have no reservations at the moment.</p>
            )}  
        </div>
    );
};

export default Reservations;
