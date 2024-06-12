import React, { useState, useEffect } from "react";
import { useAuth } from "../../RolesRoutes/AuthProvider"; 

const Profile = () => {
  const { user, login } = useAuth(); 
  console.log("User in Profile component:", user);
  const [email, setEmail] = useState(user?.email || "");
  const [creditCardInfo, setCreditCardInfo] = useState(user?.credit_card_info || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEmail(user?.email || "");
    setCreditCardInfo(user?.credit_card_info || "");
  }, [user]);



  const handleSave = async () => {
    if (!user?.username) {
        setMessage("Username is undefined. Cannot proceed with saving.");
        return; 
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("credit_card_info", creditCardInfo);
    if (photo) {
        formData.append("photo", photo);
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${user.username}/profile-update/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData
        });

        if (response.ok) {
            const updatedUser = await response.json();
            login(updatedUser);
            setMessage("Profile updated successfully!");
        } else {
            const errorData = await response.json();
            setMessage(errorData.message || "Failed to update profile");
        }
    } catch (error) {
        setMessage("An error occurred while updating the profile: " + error.toString());
    } finally {
        setLoading(false);
    }
};
        
  return (
    <div className="w-full h-screen p-4 flex justify-center items-center flex-col">
      <div className="container mx-auto p-4 w-[80%] flex flex-col justify-center items-center border">
        <h1 className="text-2xl mb-4">Update Profile</h1>
        {message && <p className="mb-4 text-red-500">{message}</p>}
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
