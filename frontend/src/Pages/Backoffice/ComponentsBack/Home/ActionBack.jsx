import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsPlay } from "react-icons/bs";
import FsLightbox from "fslightbox-react";

const ActionBack = () => {
    const [manager, setManager] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        subtitle: '',
        bio: '',
        quote: '',
        image: null,
        video_url: ''
    });
    const [toggler, setToggler] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/managers/')
            .then(response => {
                if (response.data && response.data.length > 0) {
                    setManager(response.data[0]);
                    setFormData({
                        name: response.data[0].name,
                        title: response.data[0].title,
                        subtitle: response.data[0].subtitle,
                        bio: response.data[0].bio,
                        quote: response.data[0].quote || '',
                        image: response.data[0].image,
                        video_url: response.data[0].video_url || ''
                    });
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (e.target.type === 'file') {
            setFormData({ ...formData, [name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const updateData = new FormData();
  
      Object.keys(formData).forEach(key => {
          if (key === 'image' && formData[key] instanceof File) {
              updateData.append(key, formData[key], formData[key].name);
          } else if (formData[key] !== manager[key] && formData[key] != null) {
              updateData.append(key, formData[key]);
          }
      });
  
      axios.patch(`http://127.0.0.1:8000/api/managers/${manager.id}/`, updateData, {
          headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
          setManager(response.data);
          setEditMode(false);
      })
      .catch(error => {
          console.error('Failed to update manager', error);
      });
    };
  
    if (!manager) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8 w-[80%]">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden p-5">
                <div className="text-center">
                    <button onClick={() => setEditMode(!editMode)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {editMode ? 'Cancel' : 'Edit Manager'}
                    </button>
                </div>
                {editMode ? (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="ml-2 border" />
                        </div>
                        <div>
                            <label>Title:</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="ml-2 border" />
                        </div>
                        <div>
                            <label>Subtitle:</label>
                            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="ml-2 border" />
                        </div>
                        <div>
                            <label>Bio:</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} className="ml-2 border" />
                        </div>
                        <div>
                            <label>Quote:</label>
                            <textarea name="quote" value={formData.quote} onChange={handleChange} className="ml-2 border" />
                        </div>
                        <div>
                            <label>Image:</label>
                            <input type="file" name="image" onChange={handleChange} className="ml-2" />
                        </div>
                        <div>
                            <label>Video URL:</label>
                            <input type="url" name="video_url" value={formData.video_url} onChange={handleChange} className="ml-2 border" />
                        </div>
                        <div className="text-center">
                            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="p-4 flex flex-col justify-center items-center gap-4">
                        <img src={manager.image} alt="Manager" className="w-32 h-32 object-cover mt-2" />
                        <h3 className="text-lg font-semibold">{manager.name}</h3>
                        <p>{manager.subtitle}</p>
                        <p>{manager.title}</p>
                        <p className="w-[70%]">{manager.bio}</p>
                        <p><i>"{manager.quote}"</i></p>
                        <video src={manager.video_url} controls className="w-[25rem] mt-2"></video>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionBack;
