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
        <div className="container mx-auto px-4 py-8 w-full">
            <h3 className='text-2xl font-Garamond uppercase underline p-2 text-center mt-3 mb-5'>MANAGER</h3>
            <div className="text-center">
                    <button onClick={() => setEditMode(!editMode)} className="btn-primary text-white font-bold py-2 px-4 rounded mt-2 mb-5">
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
                    <div className=" w-full grid grid-cols-1 lg:grid-cols-2 items-center ">

                        <div className="bg-[#f8f6f3] dark:bg-normalBlack space-y-[14px] flex-1 font-Garamond px-5 sm:px-7 md:px-9 lg:pl-[70px] py-10 md:py-[96px] lg:pr-[70px]">    
                            <h5 className="text-base text-khaki leading-[26px] font-semibold">
                            {manager.subtitle}
                            </h5>
                            <h1 className="text-[22px] sm:text-2xl md:text-[28px] xl:text-[32px] 2xl:text-[38px] leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold">
                            {manager.title}
                            </h1>
                            <p className="text-sm sm:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px]">
                            {manager.bio}
                            </p>
                            <p className="text-sm sm:text-base font-Lora italic leading-[26px] underline  text-gray dark:text-lightGray font-normal ">
                            "{manager.quote}"
                            </p>
                            <div className="flex items-center space-x-6 pt-5">
                            <img
                                src={manager.image}
                                className="w-[65px] h-[65px] object-cover"
                                alt=""
                            />

                            <div className="">
                                <h4 className="text-lg sm:text-[22px] leading-[26px] text-lightBlack dark:text-white font-semibold font-Garamond">
                                {manager.name}
                                </h4>
                                <p className="pt-1 text-base leading-[26px] font-normal text-gray dark:text-lightGray flex items-center font-Lora">
                                <span className="w-5 h-[1px] inline-block text-khaki bg-khaki mr-2"></span>
                                {manager.subtitle}
                                </p>
                            </div>
                            </div>
                        </div>
                        <div
                            className="flex-1 h-[100%] w-full relative "
                        >

                            <video
                            muted
                            loop
                            playsInline
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            src={manager.video_url}
                            />


                            <div
                            className="w-[70px] h-[70px]  text-white absolute top-1/2 md:top-[35%] lg:top-1/2 left-[45%] bg-khaki rounded-full flex items-center justify-center cursor-pointer z-[1] "
                            onClick={() => setToggler(!toggler)}
                            >
                            <BsPlay className="w-8 h-8" />
                            </div>
                            <span className=" top-[47%] md:top-[33%] lg:top-[48%] left-[42%] lg:left-[43.5%] border w-[90px] h-[90px] rounded-full absolute border-white video-animation"></span>
                        </div>
                        <FsLightbox
                            toggler={toggler}
                            sources={[manager.video_url]}
                        />
                        </div>

                )}


        </div>
    );
};

export default ActionBack;
