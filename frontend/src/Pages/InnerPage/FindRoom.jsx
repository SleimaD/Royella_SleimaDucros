import React, { useState, useEffect } from 'react';
import { BiChevronDown, BiCalendar } from "react-icons/bi";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { IoIosCall } from 'react-icons/io';
import { MdEmail, MdOutlineShareLocation } from "react-icons/md";



const FindRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [beds, setBeds] = useState(1);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedInDate, setSelectedInDate] = useState(null);
  const [selectedOutDate, setSelectedOutDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [otherSubject, setOtherSubject] = useState('');
  const [message, setMessage] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const navigate = useNavigate();





    useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/contact-subjects/');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/contact-messages/', {
        name,
        email,
        subject: subject === 'other' ? null : subject,
        other_subject: subject === 'other' ? otherSubject : '',
        message
      });
      setFeedback('Message sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setOtherSubject('');
      setMessage('');
    } catch (error) {
      setFeedback('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  };




  useEffect(() => {
    fetchAllRooms(1);
  }, []);

  const fetchAllRooms = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/rooms/', {
        params: {
          page: page,
        }
      });
      setRooms(response.data.results);
      setFilteredRooms(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 6));
    } catch (error) {
      console.error('Error fetching all rooms:', error);
    }
    setLoading(false);
  };

  const fetchAvailableRooms = async (page) => {
    setLoading(true);
    try {
        const checkInDate = formatDate(selectedInDate);
        const checkOutDate = formatDate(selectedOutDate);

        if (!checkInDate || !checkOutDate) {
            console.error('Invalid dates provided.');
            setLoading(false);
            return;
        }

        const response = await axios.post('http://localhost:8000/rooms/check_availability/', {
            start_date: checkInDate,
            end_date: checkOutDate,
            adults: adult,
            children: children,
            beds: beds,
            page: page,
        });
        setFilteredRooms(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 6));
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        setFilteredRooms([]);
    }
    setLoading(false);
};

  const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const month = `${d.getMonth() + 1}`.padStart(2, '0');
      const day = `${d.getDate()}`.padStart(2, '0');
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
  };

  const handleCheckInDate = (date) => {
    setSelectedInDate(date);
  };

  const handleCheckOutDate = (date) => {
    setSelectedOutDate(date);
  };

  const handleBooking = (room) => {
    if (!selectedInDate || !selectedOutDate) {
      alert('Please select check-in and check-out dates.');
      return;
    }
    if (adult < 1) {
      alert('At least one adult must be selected.');
      return;
    }
    navigate('/room_details', { state: { room, selectedInDate, selectedOutDate, adult, children } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (selectedInDate && selectedOutDate && adult >= 1) {
      fetchAvailableRooms(page);
    } else {
      fetchAllRooms(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-4 py-2 ${currentPage === i ? 'bg-khaki text-white' : 'bg-white text-khaki'} rounded`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleClearFilters = () => {
    setSelectedInDate(null);
    setSelectedOutDate(null);
    setAdult(1);
    setChildren(0);
    setBeds(1);
    fetchAllRooms(1);
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
    <section>
      <BreadCrumb title="Find Room" pageName="find_rooms" />
      <div className="bg-whiteSmoke dark:bg-normalBlack py-20 2xl:py-[120px]">
        <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[34px] leading-7 sm:leading-8 md:leading-9 lg:leading-10 2xl:leading-[44px] text-lightBlack dark:text-white mb-5 md:mb-8 lg:mb-10 font-Garamond font-semibold uppercase text-center">
          CHECK Availability
        </h1>
        <div
          className="Container bg-white dark:bg-lightBlack grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 items-center justify-center font-Lora py-3 lg:py-4 xl:grid-cols-5 2xl:py-6 border-t-[3px] border-t-khaki px-5 md:px-7 2xl:px-10"
          
        >
          <div className="p-3 relative">
            <p className="text-sm text-gray dark:text-lightGray">Check In</p>
            <div className="flex items-center pt-[6px] relative">
              <BiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray dark:text-lightGray z-10" />
              <DatePicker
                selected={selectedInDate}
                onChange={handleCheckInDate}
                className="border-none pl-8 bg-transparent focus:outline-transparent focus:border-transparent text-lightBlack dark:text-white focus:border-none outline-0 text-sm lg:text-base focus:ring-transparent w-full z-10"
                placeholderText="Select check-in date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          <div className="p-3 relative">
            <p className="text-sm text-gray dark:text-lightGray">Check Out</p>
            <div className="flex items-center pt-[6px] relative">
              <BiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray dark:text-lightGray z-10" />
              <DatePicker
                selected={selectedOutDate}
                onChange={handleCheckOutDate}
                className="border-none pl-8 bg-transparent focus:outline-transparent focus:border-transparent text-lightBlack dark:text-white focus:border-none outline-0 text-sm lg:text-base focus:ring-transparent w-full"
                placeholderText="Select check-out date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
          </div>
          <div className="p-3">
            <div
              className={`px-3 py-2 w-full block transition-all duration-300 group relative`}
            >
              <span
                className="flex items-center justify-between text-sm text-gray dark:text-lightGray cursor-pointer"
                onClick={() => setOpen(!open)}
                title="click here to open and close beds extender"
              >
                Beds
                <BiChevronDown className="" />
              </span>
              <div className="text-sm pt-[6px] lightBlack dark:text-white">
                {beds} Bed{beds > 1 ? 's' : ''}
              </div>
              <div className="absolute pt-5 z-20">
                <div
                  className={`shadow-2xl ${open ? "" : "hidden"} rounded-sm bg-white text-black w-60 text-left dark:bg-normalBlack dark:text-white transition-all duration-500 text-sm py-4`}
                >
                  <div className="py-2 px-5 group cursor-pointer">
                    <li className="flex items-center justify-between">
                      <div className="text-lightBlack dark:text-white">
                        {beds} Bed{beds > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setBeds(beds + 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setBeds(beds - 1)}
                          disabled={beds <= 1}
                        >
                          -
                        </button>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3">
            <div
              className={`text-lightBlack lg:text-white dark:text-white lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative`}
            >
              <span
                className="flex items-center justify-between text-sm text-gray dark:text-lightGray cursor-pointer"
                onClick={() => setGuestOpen(!guestOpen)}
                title="click here to open and close Adult And Children extender"
              >
                Guests
                <BiChevronDown className="" />
              </span>
              <div className="pt-[6px] text-sm text-lightBlack dark:text-white">
                {adult} Adult{adult > 1 ? 's' : ''}, {children} Child{children > 1 ? 'ren' : ''}
              </div>
              <div className="absolute pt-5 z-20 right-0 md:left-5">
                <div
                  className={`shadow-2xl ${guestOpen ? "" : "hidden"} rounded-sm bg-white text-black w-60 text-left dark:bg-normalBlack dark:text-white transition-all duration-500 text-sm py-4`}
                >
                  <div className="py-2 px-5 group cursor-pointer">
                    <li className="flex items-center justify-between">
                      <div className="">{adult} Adult{adult > 1 ? 's' : ''}</div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setAdult(adult + 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setAdult(adult - 1)}
                          disabled={adult <= 1}
                        >
                          -
                        </button>
                      </div>
                    </li>
                    <li className="flex items-center justify-between mt-1">
                      <div className="">{children} Child{children > 1 ? 'ren' : ''}</div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setChildren(children + 1)}
                        >
                          +
                        </button>
                        <button
                          className="w-5 h-5 md:w-6 md:h-6 bg-khaki text-white"
                          onClick={() => setChildren(children - 1)}
                          disabled={children < 1}
                        >
                          -
                        </button>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => fetchAvailableRooms(1)}
            className="w-[142px] h-[50px] text-[15px] bg-khaki font-Garamond text-white"
          >
            Check Availability
          </button>
          <button
            onClick={handleClearFilters}
            className="w-[142px] h-[50px] text-[15px] bg-gray-300 font-Garamond text-black ml-2"
          >
            Clear Filters
          </button>
        </div>
        {loading ? (
          <div className="text-center text-khaki mt-10">Loading...</div>
        ) : (
          <>
            <div className="mt-14 2xl:mt-[60px] grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-[30px] Container">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <div key={room.id} data-aos="zoom-in-up" data-aos-duration="1000">
                    <div className="overflow-x-hidden 3xl:w-[410px] group relative">
                      <div className="relative">
                        <div className="overflow-hidden">
                          <img
                            src={room.image}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                            alt={room.name}
                          />
                        </div>
                        <button
                          className="flex items-center justify-center text-[15px] leading-[38px] bg-lightBlack absolute bottom-0 -left-40 px-5 text-white group-hover:left-0 transition-all duration-300 hover:bg-khaki"
                          onClick={() => handleBooking(room)}
                        >
                          View Details{" "}
                          <BsArrowRight className="w-4 h-4 ml-2 text-white" />{" "}
                        </button>
                      </div>
                      <div className="font-Garamond">
                        <div className="px-5 3xl:px-6 py-2 inline-flex bg-khaki text-sm items-center justify-center text-white absolute top-[10px] right-[10px] font-Lora font-normal leading-[26px]">
                          <span className="">${room.price}</span>
                          <span className="mx-2">|</span>
                          <span>Night</span>
                        </div>

                        <div className="border-[1px] border-[#e8e8e8] dark:border-[#424242] border-t-0">
                          <div className="py-6 px-[30px]">
                            <h4 className="text-sm leading-[26px] text-khaki uppercase font-semibold">
                              {room.name}
                            </h4>
                            <Link to="/room_details">
                              <h2 className="text-2xl lg:text-[28px] leading-[26px] font-semibold text-lightBlack dark:text-white py-4">
                                {room.name}
                              </h2>
                            </Link>
                            <p className="text-sm font-normal text-gray dark:text-lightGray font-Lora">
                              {room.dimensions}
                            </p>
                          </div>
                          <div className="border-t-[1px] border-[#e8e8e8] dark:border-[#424242] py-5">
                            <div className="px-[30px] flex items-center justify-between">
                              <div className="">
                                <span className="font-Lora text-base flex items-center ">
                                  <img
                                    src="/images/home-1/room-bottom-icon.png"
                                    alt=""
                                  />
                                  <span className="ml-[10px] text-gray dark:text-lightGray">
                                    {room.beds}
                                  </span>
                                </span>
                              </div>
                              <span className="w-[1px] h-[25px] bg-[#ddd] dark:bg-gray"></span>
                              <ul className="flex items-center text-khaki space-x-[5px]">
                                {[...Array(room.stars)].map((_, i) => (
                                  <li key={i}>
                                    <FaStar />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-khaki mt-10">No rooms available</div>
              )}
            </div>
            <div className="mt-10 flex justify-center">{renderPagination()}</div>
          </>
        )}
      </div>
            {/* Contact form */}
            <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
        <div className="Container border border-lightGray dark:border-gray px-2 sm:px-7 md:px-10 lg:px-14 2xl:px-20 py-10 md:py-14 lg:py-18 xl:py-20 2xl:py-[100px]">
          <div className="flex items-center flex-col md:flex-row">
            <div
              className="p-5 flex-1"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <p className="font-Garamond text-base leading-[26px] text-khaki font-medium">
                CONTACT US
              </p>
              <h2 className="font-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-uppercase text-lightBlack dark:text-white font-semibold my-3 md:my-5">
                CONTACT WITH US
              </h2>
              <p className="font-Lora text-sm sm:text-base leading-[26px] text-gray dark:text-lightGray font-normal">
                Rapidiously myocardinate cross-platform intellectual capital
                after the model. Appropriately create interactive
                infrastructures after maintance Holisticly facilitate
                stand-alone
              </p>

              {/* call */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-whiteSmoke dark:bg-normalBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full">
                  <IoIosCall
                    size={20}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray font-normal dark:text-lightGray">
                    Call Us Now
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium">
                    {contactInfo.phone}
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />
              {/* email */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-whiteSmoke dark:bg-normalBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full">
                  <MdEmail
                    size={20}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray font-normal dark:text-lightGray">
                    Send Email
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium ">
                    {contactInfo.email}
                  </p>
                </div>
              </div>
              <hr className="dark:text-gray dark:bg-gray text-lightGray bg-lightGray h-[1px]" />
              {/* location */}
              <div className="flex items-center my-4 md:my-5 lg:my-[26px] group">
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px] 2xl:w-[60px] 2xl:h-[60px] bg-whiteSmoke dark:bg-normalBlack group-hover:bg-khaki dark:group-hover:bg-khaki grid items-center justify-center rounded-full p-4 px-6 ">
                  <MdOutlineShareLocation
                    size={20}
                    className="text-khaki group-hover:text-whiteSmoke"
                  />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="font-Lora text-sm leading-[26px] text-gray font-normal dark:text-lightGray">
                    Our Locations
                  </p>
                  <p className="font-Garamond text-lg sm:text-xl md:text-[22px] leading-[26px] text-lightBlack dark:text-white font-medium ">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="flex-1 py-5 sm:p-5"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <div className="bg-lightBlack dark:bg-normalBlack p-[30px] lg:p-[45px] 2xl:p-[61px]">
                <h2 className="font-Garamond text-[22px] sm:text-2xl md:text-[28px] leading-7 md:leading-8 lg:leading-9 xl:leading-10 2xl:leading-[44px] text-white font-semibold text-center">
                  GET IN TOUCH
                </h2>
                <form onSubmit={handleSubmit} className="grid items-center grid-cols-1 gap-2 mt-8">
                  <input
                    type="text"
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-gray dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-gray dark:focus:border-lightGray focus:outline-none"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-gray dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-gray dark:focus:border-lightGray focus:outline-none"
                    placeholder="Enter E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <select
                    className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-gray dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 focus:border-gray dark:focus:border-lightGray focus:outline-none"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Subject</option>
                    {subjects.map((subj) => (
                      <option key={subj.id} value={subj.id}>
                        {subj.subject}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                  {subject === 'other' && (
                    <input
                      type="text"
                      className="w-full h-12 md:h-13 lg:h-[59px] px-4 border border-gray dark:border-lightGray text-gray dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray focus:border-gray dark:focus:border-lightGray focus:outline-none"
                      placeholder="Other Subject"
                      value={otherSubject}
                      onChange={(e) => setOtherSubject(e.target.value)}
                      required
                    />
                  )}
                  <textarea
                    name="message"
                    cols="30"
                    rows="10"
                    className="w-full h-[121px] px-4 border border-gray dark:border-lightGray text-gray dark:text-lightGray outline-none bg-transparent mt-4 focus:ring-0 placeholder:text-gray resize-none focus:border-gray dark:focus:border-lightGray focus:outline-none"
                    placeholder="Write Message:"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                  <button className="w-full bg-khaki text-white text-center h-10 2xl:h-[55px] mt-5">
                    SEND MESSAGE
                  </button>
                </form>
                {feedback && <p className="mt-4 text-center text-white">{feedback}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default FindRoom;
