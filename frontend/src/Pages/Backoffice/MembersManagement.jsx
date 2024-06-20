import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFacebookF, FaLinkedinIn, FaPinterestP, FaTwitter } from "react-icons/fa";
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { ImBin } from "react-icons/im";

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [createMode, setCreateMode] = useState(false); 

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/members/");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleCreateToggle = () => {
    setCreateMode(!createMode);
    reset();
  };

  const handleEditToggle = (member) => {
    if (editMode === member.id) {
      setEditMode(null);
      reset();
    } else {
      setEditMode(member.id);
      setValue("name", member.name);
      setValue("position", member.position);
      setValue("email", member.email);
      setValue("facebook", member.facebook);
      setValue("twitter", member.twitter);
      setValue("linkedin", member.linkedin);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/members/${id}/`);
      fetchMembers();
      Swal.fire({
        title: 'Deleted!',
        text: 'The member has been deleted.',
        icon: 'success',
        confirmButtonColor: '#008000',
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the member.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    formData.append("email", data.email);
    if (data.image[0]) formData.append("image", data.image[0]);
    formData.append("facebook", data.facebook);
    formData.append("twitter", data.twitter);
    formData.append("linkedin", data.linkedin);

    try {
      if (editMode) {
        await axios.patch(`http://127.0.0.1:8000/api/members/${editMode}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditMode(null);
      } else {
        await axios.post('http://127.0.0.1:8000/api/members/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setCreateMode(false);
      }
      fetchMembers();
      reset();
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  return (
    <div className="p-8 ">
      <h1 className="text-5xl font-bold text-center font-Garamond mb-14 mt-5">MEMBERS MANAGEMENT</h1>
      <button 
        onClick={handleCreateToggle} 
        className="btn-primary text-white  rounded mb-4"
      >
        {createMode ? "Cancel" : "Add New Member"}
      </button>

      {createMode && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-10 bg-whiteSmoke p-14 flex flex-wrap justify-center items-center gap-5 shadow-lg relative">
          <h1 className='absolute top-2 mb-3 font-Garamond underline'>New Member</h1>
          <input {...register("name")} placeholder="Name" className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray" />
          <input {...register("position")} placeholder="Position" className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray" />
          <input {...register("email")} placeholder="Email" className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray" />
          <input type="file" {...register("image")} className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray bg-white" />
          <input {...register("facebook")} placeholder="Facebook URL" className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray" />
          <input {...register("twitter")} placeholder="Twitter URL" className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray" />
          <input {...register("linkedin")} placeholder="LinkedIn URL" className="block mb-2 p-2 border border-b-4 border-[#faf3fa] border-b-gray" />
          <button type="submit" className="btn-primary text-white">Save</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="member bg-white p-4 rounded shadow-md relative">
            <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-xl font-bold">{member.name}</h2>
            <p className="text-gray-600">{member.position}</p>
            <p className="text-gray-600">{member.email}</p>
            <div className="flex justify-center space-x-4 mt-4">
              {member.facebook && <a href={member.facebook}><FaFacebookF /></a>}
              {member.twitter && <a href={member.twitter}><FaTwitter /></a>}
              {member.linkedin && <a href={member.linkedin}><FaLinkedinIn /></a>}
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                onClick={() => handleEditToggle(member)} 
                className="bg-[#a88550] text-white py-1 px-3 "
              >
                {editMode === member.id ? "Cancel" : "Edit"}
              </button>
              <button 
                onClick={() => handleDelete(member.id)} 
                className=" py-1 px-3 rounded"
              >
                <ImBin size={20} className="text-red-500" />
              </button>
            </div>

            {editMode === member.id && (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 p-4">
                <input {...register("name")} placeholder="Name" className="block mb-2 p-2 border border-b-2 w-[15rem] bg-slate-100 " />
                <input {...register("position")} placeholder="Position" className="block mb-2 p-2 border border-b-2 w-[15rem] bg-slate-100 " />
                <input {...register("email")} placeholder="Email" className="block mb-2 p-2 border border-b-2 w-[15rem] bg-slate-100 " />
                <input type="file" {...register("image")} className=" w-[15rem] mb-2 p-2" />
                <input {...register("facebook")} placeholder="Facebook URL" className="block mb-2 p-2 border border-b-2 w-[15rem] bg-slate-100 " />
                <input {...register("twitter")} placeholder="Twitter URL" className="block mb-2 p-2 border border-b-2 w-[15rem] bg-slate-100 " />
                <input {...register("linkedin")} placeholder="LinkedIn URL" className="block mb-2 p-2 border border-b-2 w-[15rem] bg-slate-100 " /> 
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
              </form>
            )}
          </div>
        ))}
      </div>
      <div className='w-50 h-[7rem] bg-white'></div>
    </div>
  );
};

export default MemberManagement;
