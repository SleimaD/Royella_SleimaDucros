import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosCall } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { BiEnvelope, BiLogoLinkedin } from "react-icons/bi";
import { FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import Brand from "../../Components/Brand/Brand";

const Footer = () => {
  const [gallery, setGallery] = useState([]);
  const [randomGallery, setRandomGallery] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
  });


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

  useEffect(() => {
    if (gallery.length > 0) {
      const selectRandomImages = (images, count) => {
        const shuffled = images.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      setRandomGallery(selectRandomImages(gallery, 6));
    }
  }, [gallery]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/newsletter-subscribers/', { email });
      setMessage('Subscription successful!');
      setEmail('');
    } catch (error) {
      setMessage('Subscription failed. Try again.');
      console.error('Error subscribing to newsletter:', error);
    }
  };

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/contact-info/');
        setContactInfo(response.data[0]);  
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);




  return (
    <>
      <Brand />
      <footer className="">
        {/* footer content */}
        <div className="bg-lightBlack">
          <div className="Container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 2xl:grid-cols-12 gap-5 lg:gap-3 xl:gap-5 2xl:gap-[30px] pt-14 lg:pt-[100px]">
            {/* Footer Content one. */}
            <div
              className="lg:mt-[-195px] lg:col-span-3 2xl:col-span-4 bg-[#272727]"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="py-6 md:py-7 lg:py-[50px] px-10 lg:px-5 xl:px-8 2xl:px-9">
                <img src="/images/home-1/logo-1.png" alt="" />
                <div className="py-8 2xl:py-[50px]">
                  <h1 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-khaki before:absolute before:left-0 before:top-10">
                    CONTACT INFO
                  </h1>
                  <div className="space-y-4 pt-[30px] pb-2 2xl:pb-[30px]">
                    <p className="flex items-center text-lightGray font-Lora font-normal text-sm sm:text-base leading-[26px] mt-2">
                      <IoIosCall
                        className="text-khaki w-5 h-5 mr-3 2xl:mr-4"
                        size={14}
                      />
                      {contactInfo.phone}
                    </p>
                    <p className="flex items-center text-lightGray font-Lora font-normal text-sm sm:text-base leading-[26px]">
                      <BiEnvelope
                        className="text-khaki w-5 h-5 mr-3 2xl:mr-4"
                        size={14}
                      />
                      {contactInfo.email}
                    </p>
                    <p className="flex items-center text-lightGray font-Lora font-normal text-sm sm:text-base leading-[26px]">
                      <IoLocationSharp
                        className="text-khaki w-5 h-5 mr-3 2xl:mr-4"
                        size={14}
                      />
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
                <div>
                  <ul className="flex space-x-3">
                    <li className="hover-animBg group transition-all duration-300 rounded-full border border-lightGray border-opacity-75 hover:border-khaki cursor-pointer w-[37px] h-[37px] grid items-center justify-center">
                      <Link to="https://www.facebook.com/molengeek/" className="">
                        <FaFacebookF className="text-lightGray text-opacity-75 group-hover:text-white group-hover:text-slateBlue-0 w-4 h-4" />
                      </Link>
                    </li>
                    <li className="hover-animBg group transition-all duration-300 rounded-full border border-lightGray border-opacity-75 hover:border-khaki cursor-pointer w-[37px] h-[37px] grid items-center justify-center">
                      <Link to="https://twitter.com/molengeek">
                        <FaTwitter className="text-lightGray text-opacity-75 group-hover:text-white group-hover:text-slateBlue-0 w-4 h-4" />
                      </Link>
                    </li>
                    <li className="hover-animBg group transition-all duration-300 rounded-full border border-lightGray border-opacity-75 hover:border-khaki cursor-pointer w-[37px] h-[37px] grid items-center justify-center">
                      <Link to="https://www.instagram.com/molengeek/">
                        <BiLogoLinkedin className="text-lightGray text-opacity-75 group-hover:text-white group-hover:text-slateBlue-0 w-4 h-4" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* footer content-2 */}
            <div
              className="pt-0 pb-8 overflow-x-hidden lg:col-span-2 2xl:col-span-2 ml-2"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h1 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-khaki before:absolute before:left-0 before:top-10 uppercase">
                UseFul Links
              </h1>
              <div className="pt-[30px] pb-0 lg:py-[30px]">
                <ul className="text-lightGray font-Lora font-normal text-sm sm:text-base leading-[26px] list-none hover:list-disc">
                  <li className="hover:ml-[17px] md:hover:ml-[18px] transition-all duration-500 hover:text-khaki leading-[44px]">
                    <Link to="/about">About Hotel</Link>
                  </li>
                  <li className="hover:ml-[17px] md:hover:ml-[18px] transition-all duration-500 hover:text-khaki leading-[44px]">
                    <Link to="/find_room">Rooms & Suites</Link>
                  </li>
                  <li className="hover:ml-[17px] md:hover:ml-[18px] transition-all duration-500 hover:text-khaki leading-[44px]">
                    <Link to="/blog">News & Blogs</Link>
                  </li>
                  <li className="hover:ml-[17px] md:hover:ml-[18px] transition-all duration-500 hover:text-khaki leading-[44px]">
                    <Link to="/contact" >Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* footer content-3 */}
            <div
              className="pt-0 pb-8 lg:col-span-3 2xl:col-span-3"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h1 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-khaki before:absolute before:left-0 before:top-10 uppercase">
                GALLERY
              </h1>
              <div className="grid grid-cols-3 gap-2 mt-[45px] w-[250px] sm:w-[300px] lg:w-full content-center">
                {randomGallery.map((gallery, index) => (
                  <div key={index} className="w-[250px] sm:w-[300px] lg:w-full">
                    <img className='w-[130px] h-[80px]' src={gallery.image} alt="" />
                  </div>
                ))}
              </div>
            </div>
            {/* footer content-4 */}
            <div
              className="pt-0 pb-8 overflow-x-hidden lg:col-span-2 2xl:col-span-3"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h1 className="text-lg sm:text-xl md:text-[22px] leading-[38px] font-medium text-white relative font-Garamond before:w-7 before:h-[1px] before:bg-khaki before:absolute before:left-0 before:top-10 uppercase ">
                NEWSLETTER
              </h1>
              <div className="space-y-4 py-[30px]">
                <p className="text-lightGray font-Lora font-normal text-sm sm:text-base leading-[26px]">
                  Subscribe our Newsletter
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="placeholder:text-gray placeholder:font-Lora placeholder:font-normal placeholder:text-[15px] text-center h-[56px] w-full px-10 placeholder:leading-[26px] text-[15px] text-gray border-none outline-none focus:outline-none focus:border-khaki focus:ring-0"
                    required
                  />
                  <button type="submit" className="btn-subscribe">Subscribe Now</button>
                </form>
                {message && <p className="text-lightGray font-Lora text-sm sm:text-base">{message}</p>}
              </div>
            </div>
          </div>
          <div className="text-center py-5 2xl:py-7 bg-[#161616] text-sm md:text-base text-lightGray font-Lora font-normal">
            {` © ${new Date().getFullYear()} , Royella. All Rights Reserved.`}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
