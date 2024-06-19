import React, { useState, useEffect } from "react";
import { useAuth } from "../../RolesRoutes/AuthProvider"; 
import "./../../index.css";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";
import { MdAlternateEmail } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaUpload } from "react-icons/fa";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [email, setEmail] = useState(user?.email || "");
    const [creditCardInfo, setCreditCardInfo] = useState(user?.credit_card_info || "");
    const [username, setUsername] = useState(user?.username || "");
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [photoName, setPhotoName] = useState("");
    const [showCancel, setShowCancel] = useState(false);

    useEffect(() => {
        console.log("User data:", user);
        setEmail(user?.email || "");
        setCreditCardInfo(user?.credit_card_info || "");
        setUsername(user?.username || "");
    }, [user]);

    const initialProfile = {
        email: user?.email || "",
        creditCardInfo: user?.credit_card_info || "",
        username: user?.username || "",
    };

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
                },
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser.data);
                setMessage("Profile updated successfully!");
                setShowCancel(false);
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

    const handleCancel = () => {
        setEmail(initialProfile.email);
        setCreditCardInfo(initialProfile.creditCardInfo);
        setUsername(initialProfile.username);
        setPhoto(null);
        setPhotoName("");
        setShowCancel(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);
        setPhotoName(file.name); 
        setShowCancel(true);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setShowCancel(true);
    };


    const profileImage = user?.photo ? `http://127.0.0.1:8000${user.photo}` : "";

    return (
        <div className="w-full h-[100vh] mb-[25rem] ">
            <div className="imgprofil relative ">
                <div className="absolute top-[22rem] left-[10rem] flex justify-center items-center">
                    {profileImage && <img src={profileImage} alt={user?.username} className="w-[15rem] h-[15rem] border-4 border-[#a9a9a9]  rounded-full z-10" />}
                    <div className="w-[25rem] h-[10rem] bg-white rounded-tr-full  absolute left-[12rem] p-5 flex flex-col items-center gap-2 top-[2rem]">
                        <h3 className="text-5xl text-black font-Garamond uppercase font-bold mt-4 ">{user?.username} <span className=" text-sm">({user?.role})</span></h3>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-full p-4 flex justify-center items-center flex-col gap-5 bg-white">
                <h1 className="text-5xl mb-10 font-Garamond font-bold uppercase ">Update Profile</h1>
                <div className="container mx-auto p-10 w-[80%] h-[30rem] flex flex-col justify-center items-center bg-[#f8f6f3] ">
                    {message && <p className="mb-4 text-red-500">{message}</p>}
                    <div className="mb-4 w-full flex justify-center items-center gap-8 ">
                        <div className="flex flex-col justify-center items-center gap-2 w-[50%]">
                            <div className="mb-4 flex items-center gap-2 ">
                                <label className="block text-gray-700">
                                    <MdDriveFileRenameOutline size={35} className="text-khaki" />
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleInputChange(setUsername)}
                                    className="mt-1 block rounded-md input-username w-[20rem]"
                                    placeholder="Username"
                                />
                            </div>
                            <div className="mb-4 flex items-center gap-2">
                                <label className="block text-gray-700">
                                    <MdAlternateEmail size={35} className="text-khaki" />
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    className="mt-1 block  input-email "
                                    placeholder="Email"
                                />
                            </div>
                            <div className="mb-4 flex items-center gap-2">
                                <label className="block text-gray-700">
                                    <BsFillCreditCard2FrontFill size={35} className="text-khaki" />
                                </label>
                                <input
                                    type="text"
                                    value={creditCardInfo}
                                    onChange={handleInputChange(setCreditCardInfo)}
                                    className="mt-1 block  input-creditcard w-[20rem]"
                                    placeholder="Credit Card Info "
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="custum-file-upload" htmlFor="file">
                                <div className="icon">
                                    <FaUpload size={35} className="text-khaki icon-svg" />
                                </div>
                                <div className="text">
                                    <span>Click to upload image</span>
                                </div>
                                <input type="file" id="file"  onChange={handleFileChange} />
                            </label>
                            {photoName && (
                                <p className="text-gray-700  mt-2">{photoName}</p>
                            )}
                        </div>
                    </div>
                    <button onClick={handleSave} className="btn-primary mt-5" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    {showCancel && (
                        <button onClick={handleCancel} className="btn-secondary  bg-red-600 z-10 mt-5">
                            Cancel
                        </button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Profile;
