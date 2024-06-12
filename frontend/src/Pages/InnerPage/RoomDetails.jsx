import React, { useState, useEffect } from 'react';
import { BsArrowLeft, BsArrowRight, BsCheck2 } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import * as FaIcons from "react-icons/fa";
import { useAuth } from "../../RolesRoutes/AuthProvider";

const RoomDetails = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [roomData, setRoomData] = useState(null);
  const location = useLocation();
  const bookingsData = location.state;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { room, discount } = location.state;
  const [finalPrice, setFinalPrice] = useState(room.price);

  useEffect(() => {
    if (discount) {
      const discountedPrice = room.price * (1 - discount / 100);
      setFinalPrice(discountedPrice);
    }
  }, [discount, room.price]);


  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (bookingsData && bookingsData.room && bookingsData.room.id) {
        try {
          const response = await axios.get(`http://localhost:8000/api/rooms/${bookingsData.room.id}/`);
          setRoomData(response.data);
        } catch (error) {
          console.error("Error fetching room details:", error);
        }
      }
    };
    fetchRoomDetails();
  }, [bookingsData]);

  const prevBtn = () => {
    setImageIndex((prevIndex) => (prevIndex - 1 + (roomData.images ? roomData.images.length : 0)) % (roomData.images ? roomData.images.length : 0));
  };

  const nextBtn = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % (roomData.images ? roomData.images.length : 0));
  };

  const handleBooking = async () => {
    if (!user) {
      Swal.fire({
        title: "Attention!",
        text: "Vous devez être connecté pour réserver une chambre.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Se connecter",
        color: "#fff",
        background: "#c19d68",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (!user.credit_card_info) {
      Swal.fire({
        title: "Attention!",
        text: "Vous devez ajouter une carte bancaire dans votre profil pour réserver une chambre.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#008000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ajouter une carte",
        color: "#fff",
        background: "#c19d68",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile");
        }
      });
      return;
    }

    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous allez réserver cette chambre.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je suis sûr!",
      color: "#fff",
      background: "#c19d68",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://127.0.0.1:8000/api/bookings/', {
            room: roomData.id,
            start_date: bookingsData.selectedInDate,
            end_date: bookingsData.selectedOutDate,
            guest_count: bookingsData.adult + bookingsData.children,
            user: user.id
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          Swal.fire({
            title: "Félicitations!",
            text: "Réservation réussie! En attente de confirmation.",
            icon: "success",
            confirmButtonColor: "#008000",
            color: "#fff",
            background: "#c19d68",
          });
          navigate("/reservations");
        } catch (error) {
          console.error('Error making a booking:', error);
        }
      }
    });
  };

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const getDescriptionContent = (title) => {
    return roomData.descriptions.find(desc => desc.title === title)?.content || "Not available";
  };

  return (
    <section className="">
      <BreadCrumb title="Room Details" />
      <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
        <div className="Container grid grid-cols-6 md:grid-cols-7 lg:grid-cols-6 gap-5 ">
          <div className="col-span-6 md:col-span-4">
            <div
              className="overflow-hidden relative group "
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              {roomData.images && roomData.images.length > 0 ? (
                <div
                  className="carousel-imaages"
                  style={{ transform: `translateX(-${imageIndex * 100}%)` }}
                >
                  {roomData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.image}
                      alt={roomData.name}
                      className="carousel-imaage"
                    />
                  ))}
                </div>
              ) : (
                <p>No images available</p>
              )}

              {roomData.images && roomData.images.length > 1 && (
                <div className="flex">
                  <span
                    className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white dark:bg-lightBlack hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center absolute bottom-[45%] left-[-50px] group-hover:left-4 lg:group-hover:left-6 transition-all duration-300 cursor-pointer"
                    onClick={prevBtn}
                  >
                    <BsArrowLeft
                      size={20}
                      className="text-lightBlack dark:text-white hover:text-white"
                    />
                  </span>
                  <span
                    className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white dark:bg-lightBlack hover:bg-khaki dark:hover:bg-khaki grid items-center justify-center absolute bottom-[45%] right-[-50px] group-hover:right-4 lg:group-hover:right-6 transition-all duration-300 cursor-pointer"
                    onClick={nextBtn}
                  >
                    <BsArrowRight 
                      size={20}
                      className="text-lightBlack dark:text-white hover:text-white"
                    />
                  </span>
                </div>
              )}

            </div> 

            <div className="pt-5 lg:pt-[35px] pr-3">
              <p className="text-base font-Lora text-khaki">{roomData.name}</p>
              <h2
                className="py-2 sm:py-3 md:py-4 lg:py-[19px] 2xl:py-[25px] font-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] 3xl:text-[40px] leading-6 lg:leading-[26px] text-lightBlack dark:text-white font-semibold"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                {roomData.name}
              </h2>
              <p
                className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                {roomData.description}
              </p>

              <div
                className="md:flex items-center flex-col md:flex-row md:justify-between py-10 lg:py-[60px]"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <FiLogOut className="text-khaki rotate-180" size={24} />
                    <h4 className="text-xl md:text-2xl lg:text-[26px] leading-[26px] font-Garamond text-lightBlack dark:text-white font-semibold">
                      Check In
                    </h4>
                  </div>
                  <ul className="space-y-2 lg:space-y-3 mt-5 lg:mt-[30px]">
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Check-in from 9:00 AM - anytime
                      </span>
                    </li>
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Early check-in subject to availability
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <FiLogOut className="text-khaki" size={24} />
                    <h4 className="text-xl md:text-2xl lg:text-[26px] leading-[26px] font-Garamond text-lightBlack dark:text-white font-semibold">
                      Check Out
                    </h4>
                  </div>
                  <ul className="space-y-2 lg:space-y-3 mt-5 lg:mt-[30px]">
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Check-out before noon
                      </span>
                    </li>
                    <li className="flex items-center">
                      <BsCheck2 size={16} className="text-khaki mr-2" />
                      <span className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        Check-out from 9:00 AM - anytime
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div data-aos="zoom-in-up" data-aos-duration="1000">
                <h2
                  className="pb-2 sm:pb-3 md:pb-4 lg:pb-[19px] 2xl:pb-6
                font-Garamond text-[22px] sm:text-2xl md:text-3xl 2xl:text-[32px] leading-7 lg:leading-[26px] text-lightBlack dark:text-white font-semibold"
                >
                  House Rules
                </h2>
                <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora">
                  {getDescriptionContent('House Rules')}
                </p>
              </div>

              <div
                className="pt-10 2xl:pt-[60px]"
                data-aos="zoom-in-up" 
                data-aos-duration="1000"
              >
                <h2
                  className="pb-2 sm:pb-3 md:pb-4 lg:pb-[19px] 2xl:pb-6
                font-Garamond text-[22px] sm:text-2xl md:text-3xl 2xl:text-[32px] leading-7 lg:leading-[26px] text-lightBlack dark:text-white font-semibold"
                >
                  Children & Extra Beds
                </h2>
                <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora mb-5 2xl:mb-[30px]">
                  {getDescriptionContent('Children & Extra Beds')}
                </p>
                <ul className="space-y-2 lg:space-y-3">
                  <li className="flex items-center">
                    {/* <BsCheck2 size={16} className="text-khaki mr-2" /> */}
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {/* Quickly generate bricks-and-clicks */}
                    </span>
                  </li>
                  <li className="flex items-center">
                    {/* <BsCheck2 size={16} className="text-khaki mr-2" /> */}
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {/* Interactively cultivate visionary platforms */}
                    </span>
                  </li>
                  <li className="flex items-center">
                    {/* <BsCheck2 size={16} className="text-khaki mr-2" /> */}
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {/* Energistically envisioneer resource */}
                    </span>
                  </li>
                  <li className="flex items-center">
                    {/* <BsCheck2 size={16} className="text-khaki mr-2" /> */}
                    <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                      {/* Uniquely restore turnkey paradigms */}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <div>
            <div className="bg-whiteSmoke dark:bg-normalBlack px-7 py-8 md:px-8 md:py-10 lg:px-9 lg:py-11 2xl:px-10 2xl:pt-[45px] 2xl:pb-[30px] grid-flow-row-dense">
                <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 xl:leading-[50px] 2xl:leading-[60px] 3xl:leading-[70px] text-lightBlack dark:text-white font-semibold mb-4">
                  Booking
                </h4>
                <div
                  className="grid items-center gap-[18px]"
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                >
                      {
                        Object.entries({
                          'Check In': bookingsData?.selectedInDate ? new Date(bookingsData.selectedInDate).toDateString().slice(4) : new Date().toDateString().slice(4),
                          'Check Out': bookingsData?.selectedOutDate ? new Date(bookingsData.selectedOutDate).toDateString().slice(4) : new Date(new Date().getDate() + 3).toDateString().slice(4),
                          'Adult': bookingsData?.adult || "2",
                          'Children': bookingsData?.children || "1",
                          'Rooms': bookingsData?.room ? bookingsData.room.name : "Room not specified"
                        }).map(([key, value], index) => (
                          <div key={index} className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6">
                            <p className="text-sm md:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                              {key} - <span className="text-khaki">{value.toString()}</span>
                            </p>
                          </div>
                        ))
                      }
                      <div>
                        { discount ? 
                          <p className='text-khaki font-bold text-center'>${finalPrice.toFixed(2)} <small className='line-through text-[#bbbaba]'>${room.price}</small> </p>
                        : 
                          <p className='text-khaki font-bold text-center'> ${finalPrice} </p>
                        }
                      </div>
                </div>
              </div>

              <div className="py-5">
                <button
                  className="bg-khaki w-full h-10 2xl:h-[50px] text-white font-Lora font-semibold px-5 hover-animBg after:rounded-none after:bg-normalBlack"
                  onClick={handleBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>

            <div
              className="mt-3 sm:mt-4 md:mt-5 lg:mt-6"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 xl:leading-[50px] 2xl:leading-[60px] 3xl:leading-[70px] text-lightBlack dark:text-white font-semibold mb-6">
                Amenities
              </h4>
              <div className="grid items-center">
                {roomData.amenities.map((amenity, index) => {
                  const IconComponent = FaIcons[amenity.icon_name];
                  return (
                    <div
                      key={index}
                      className="flex items-center py-5 border-b-[1px] border-lightGray dark:border-gray"
                    >
                      {IconComponent && <IconComponent className="text-khaki mr-2 md:mr-3 xl:mr-[15px]" />}
                      <span className="text-sm lg:text-[15px] leading-[26px] text-gray dark:text-lightGray font-normal font-Lora">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
