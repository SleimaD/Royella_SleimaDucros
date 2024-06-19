import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";
import { IoIosCall } from "react-icons/io";


const ContactBack = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/contact-info/1/');
        setContactInfo(response.data);
        setFormData(response.data);
        setQuery(response.data.address);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (value.length > 2) {
      const newTimeoutId = setTimeout(async () => {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json`;
        try {
          const response = await axios.get(url);
          if (response.status === 200) {
            setSuggestions(response.data);
          }
        } catch (error) {
          console.error("Error fetching data from Nominatim:", error);
          setSuggestions([]);
        }
      }, 500);
      setTimeoutId(newTimeoutId);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    setFormData({
      ...formData,
      address: suggestion.display_name,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/contact-info/${formData.id}/`, formData);
      setContactInfo(formData);
    } catch (error) {
      console.error('Error updating contact info:', error);
    }
  };

  const handleCancel = () => {
    setFormData(contactInfo);
    setQuery(contactInfo.address);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!contactInfo) return <div>Loading...</div>;


  return (
    <div className='w-full mt-5 h-[100vh]  flex flex-col'>
      <h1 className="text-6xl text-center font-bold mb-4 font-Garamond ">CONTACT</h1>  
      <div className='w-full mt-5 h-screen bg-whiteSmoke'>

      <div className='w-full mt-5 h-screen bg-whiteSmoke'>
        <div className="">
          <div className="Container bg-whiteSmoke dark:bg-normalBlack flex flex-col gap-5 p-2">
            <div className="flex items-center flex-col gap-5 md:flex-row w-[80%]">
              <div className="py-5 sm:p-5 flex-1" >
              <p className="text-Garamond text-base leading-[26px] text-khaki font-medium font-Garamond">
                CONTACT US
              </p>

              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-white dark:bg-lightBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full transition-all duration-300">
                  <IoIosCall size={22} className="text-khaki group-hover:text-whiteSmoke" />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Call Us Now
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium">
                    {contactInfo.phone}
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />

              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] bg-white dark:bg-lightBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full transition-all duration-300">
                  <MdEmail size={22} className="text-khaki group-hover:text-whiteSmoke" />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Send Email
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />

              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] bg-white dark:bg-lightBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full transition-all duration-300 px-5">
                  <MdOutlineShareLocation size={25} className="text-khaki group-hover:text-whiteSmoke" />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray dark:text-lightGray font-normal">
                    Our Locations
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>


              <div className="py-5">
                <div className="bg-lightBlack p-[30px] lg:p-[45px] 2xl:p-[61px]">
                  <h2 className="font-Garamond text-[22px] sm:text-2xl md:text-[28px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-white font-semibold text-center">
                    UPDATE CONTACT INFO
                  </h2>
                  <form onSubmit={handleFormSubmit} className="grid items-center grid-cols-1 gap-2 mt-8 relative">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-gray dark:focus:border-lightGray focus:outline-none"
                      placeholder="Phone"
                      
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-gray dark:focus:border-lightGray focus:outline-none"
                      placeholder="Email"
                      
                    />
                    <input
                      type="text"
                      name="address"
                      value={query}
                      onChange={handleInputChange}
                      className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-white dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-gray dark:focus:border-lightGray focus:outline-none"
                      placeholder="Address"
                      
                    />
                    <ul ref={suggestionsRef}  className="w-full relative max-w-md mt-2 bg-white rounded-md shadow-lg">
                      <div className='h-[20rem] bg-[#ffffffac] backdrop-blur-sm overflow-y-auto absolute top-[10%] z-10'>
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </div>
                    </ul>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-khaki font-Garamond btn-primary hover:bg-[rgba(141,115,77,0.9)] text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {contactInfo && (
          <div className='p-5 w-full  bg-whiteSmoke flex justify-center'>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${contactInfo.longitude}!3d${contactInfo.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v0&zoom=15`}
              height={400}
              allowFullScreen=""
              loading="lazy"
              className="w-[60rem]"
            ></iframe>
          </div>
        )}
      </div>
    </div>

    </div>
  );
};

export default ContactBack;
