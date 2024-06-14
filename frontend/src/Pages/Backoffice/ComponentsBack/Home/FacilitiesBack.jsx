import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacilitiesBack = () => {
    const [facilities, setFacilities] = useState([]);
    const [newFacility, setNewFacility] = useState({ name: '', icon: null, image: null });
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/facilities/');
            setFacilities(response.data.map(f => ({ ...f, editing: false })));
        } catch (error) {
            console.error('Error fetching facilities', error);
            setError('Failed to fetch facilities.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
        setNewFacility({ name: '', icon: null, image: null });
    };

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        if (id) {
            setFacilities(facilities.map(f => f.id === id ? { ...f, [name]: value } : f));
        } else {
            setNewFacility(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e, id) => {
        const file = e.target.files[0];
        if (id) {
            setFacilities(facilities.map(f => f.id === id ? { ...f, [e.target.name]: file } : f));
        } else {
            setNewFacility(prev => ({ ...prev, [e.target.name]: file }));
        }
    };

    const handleSubmit = async (e, id) => {
        e.preventDefault();
        const facility = id ? facilities.find(f => f.id === id) : newFacility;
        const formData = new FormData();
        Object.keys(facility).forEach(key => {
            if (key === 'icon' || key === 'image') {
                if (facility[key] && facility[key] instanceof File) {
                    formData.append(key, facility[key], facility[key].name);
                }
            } else if (key !== 'editing') {
                formData.append(key, facility[key]);
            }
        });

        try {
            const response = id
                ? await axios.put(`http://127.0.0.1:8000/api/facilities/${id}/`, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
                : await axios.post('http://127.0.0.1:8000/api/facilities/', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
            fetchFacilities(); 
            if (!id) toggleAddForm(); 
        } catch (error) {
            console.error('Error saving facility', error);
            setError('Failed to save facility.');
        }
    };

    const deleteFacility = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/facilities/${id}/`);
            setFacilities(prev => prev.filter(f => f.id !== id));
        } catch (error) {
            console.error('Error deleting facility', error);
            setError('Failed to delete facility.');
        }
    };

    if (loading) return <p>Loading facilities...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="overflow-x-auto container w-[80%] mx-auto">
            <button onClick={toggleAddForm} className="mb-3">
                {showAddForm ? 'Cancel Adding' : 'Add New Facility'}
            </button>
            {showAddForm && (
                <form onSubmit={(e) => handleSubmit(e, null)} className="mb-4">
                    <input type="text" name="name" value={newFacility.name} onChange={(e) => handleInputChange(e)} placeholder="Facility Name" required />
                    <input type="file" name="icon" onChange={(e) => handleFileChange(e)} />
                    <input type="file" name="image" onChange={(e) => handleFileChange(e)} />
                    <button type="submit">Add Facility</button>
                </form>
            )}
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-6">Name</th>
                        <th scope="col" className="py-3 px-6">Icon</th>
                        <th scope="col" className="py-3 px-6">Image</th>
                        <th scope="col" className="py-3 px-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {facilities.map(facility => (
                        <tr key={facility.id} className="bg-white border-b">
                            <td className="py-4 px-6">
                                {facility.editing ? (
                                    <input type="text" name="name" value={facility.name} onChange={(e) => handleInputChange(e, facility.id)} required />
                                ) : (
                                    <span>{facility.name}</span>
                                )}
                            </td>
                            <td className="py-4 px-6">
                                {facility.editing ? (
                                    <input type="file" name="icon" onChange={(e) => handleFileChange(e, facility.id)} />
                                ) : (
                                    facility.icon && <img src={facility.icon} alt="Icon" width="50" height="50" />
                                )}
                            </td>
                            <td className="py-4 px-6">
                                {facility.editing ? (
                                    <input type="file" name="image" onChange={(e) => handleFileChange(e, facility.id)} />
                                ) : (
                                    facility.image && <img src={facility.image} alt="Image" width="100" height="100" />
                                )}
                            </td>
                            <td className="py-4 px-6">
                                {facility.editing ? (
                                    <>
                                        <button onClick={(e) => handleSubmit(e, facility.id)}>Save</button>
                                        <button onClick={() => setFacilities(prev => prev.map(f => f.id === facility.id ? {...f, editing: false} : f))}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setFacilities(prev => prev.map(f => f.id === facility.id ? {...f, editing: true} : f))}>Edit</button>
                                        <button onClick={() => deleteFacility(facility.id)}>Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacilitiesBack;
