import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ImBin } from "react-icons/im";

function FooterBack() {
  const [gallery, setGallery] = useState([]);
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/galleries/");
        setGallery(response.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchGallery();
  }, []);

  const handleAddImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/galleries/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setGallery([...gallery, response.data]);
      setImage(null);
      setShowForm(false);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/galleries/${id}/`);
      setGallery(gallery.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };


  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/newsletter-subscribers/");
        setSubscribers(response.data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
      }
    };

    fetchSubscribers();
  }, []);
  

  return (
    <div className="w-full mt-5 h-[100vh] flex flex-col gap-5">
      <h1 className="text-6xl text-center font-bold mb-4 font-Garamond">FOOTER</h1>
      <button
        className="self-center bg-khaki text-white font-bold py-2 px-4 btn-primary"
        onClick={() => setShowForm(!showForm)}
      >
        Add an Image
      </button>
      {showForm && (
        <div className="self-center w-[95%] mt-5 bg-whiteSmoke p-5 rounded-lg shadow-md">
          <form onSubmit={handleAddImage} className="flex flex-col items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setImage(e.target.files[0])}
              className="border rounded py-2 px-4"
              required
            />
            <div className="flex gap-4">
              <button type="submit" className="bg-khaki text-white font-bold py-2 px-4 rounded">
                Upload
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setImage(null);
                  fileInputRef.current.value = null;
                }}
                className="bg-gray-500  font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <section className="w-[95%] mt-5 bg-whiteSmoke flex flex-col p-2 gap-4 justify-center items-center shadow">
        <h3 className='text-3xl font-Garamond font-semibold'>GALLERY</h3>
        <div className="w-full flex flex-wrap justify-center items-center gap-8 p-5 h-[30rem] overflow-auto">
          {gallery.map((item, index) => (
            <div key={index} className="relative group">
              <img className="w-[12rem] h-[10rem]" src={item.image} alt="" />
              <button
                onClick={() => handleDeleteImage(item.id)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ImBin size={40} color='red' />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="w-[95%] mt-5 bg-whiteSmoke flex flex-col gap-5 justify-center items-center shadow">
          <h3 className='text-xl font-Garamond font-semibold'>SUBSCRIBERS(newsletter)</h3>
          <div>
            {subscribers.map((item, index) => (              
              <div key={index} className="flex items-center gap-4 p-2">
                <p className="text-sm">{item.email}</p>
                <p className='text-sm'>{item.date_subscribed}</p>
              </div>
            ))}
          </div>
      </section>
    </div>
  );
}

export default FooterBack;
