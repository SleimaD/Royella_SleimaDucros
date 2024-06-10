import React, { useState, useEffect } from "react";
import { useAuth } from "./../../RolesRoutes/AuthProvider";

const Profile = () => {
  const { user, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ username, email })
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
      setMessage("An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen p-4 flex justify-center items-center flex-col">
    <div className="container mx-auto p-4 w-[80%] flex flex-col justify-center items-center border">
      <h1 className="text-2xl mb-4">Profile</h1>
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
      <button onClick={handleSave} className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>

    </div>
  );
};

export default Profile;
