import React, { useState, useEffect } from "react";
import { useAuth } from "../../RolesRoutes/AuthProvider"; 

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [email, setEmail] = useState(user?.email || "");
    const [creditCardInfo, setCreditCardInfo] = useState(user?.credit_card_info || "");
    const [username, setUsername] = useState(user?.username || "");
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log("User data:", user);
        setEmail(user?.email || "");
        setCreditCardInfo(user?.credit_card_info || "");
        setUsername(user?.username || "");
    }, [user]);

    const handleSave = async () => {
        if (!username) {
            setMessage("Username is undefined. Cannot proceed with saving.");
            return;
        }

        if (!user?.id) {
            setMessage("User ID is undefined. Cannot proceed with saving.");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("credit_card_info", creditCardInfo);
        if (photo) {
            formData.append("photo", photo);
        }

        setLoading(true);
        setMessage("");
        try {
            const response = await fetch(`http://127.0.0.1:8000/profile-update/${user.id}/`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: formData,
                credentials: 'include'
                
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser.data);
                setMessage("Profile updated successfully!");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Failed to update profile.");
            }
        } catch (error) {
            setMessage("An error occurred while updating the profile: " + error.toString());
        } finally {
            setLoading(false);
        }
    };

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    return (
        <div className="w-full h-screen p-4 flex justify-center items-center flex-col">
            <div className="container mx-auto p-4 w-[80%] flex flex-col justify-center items-center border">
                <h1 className="text-2xl mb-4">Update Profile</h1>
                {message && <p className="mb-4 text-red-500">{message}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Credit Card Info</label>
                    <input
                        type="text"
                        value={creditCardInfo}
                        onChange={(e) => setCreditCardInfo(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Profile Photo</label>
                    <input
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="mt-1 block w-full border border-gray-300 rounded-md"
                    />
                </div>
                <button onClick={handleSave} className="btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
};

export default Profile;
