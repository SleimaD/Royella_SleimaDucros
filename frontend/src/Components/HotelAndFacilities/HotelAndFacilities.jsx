import React, { useState, useEffect } from 'react';
import axios from 'axios';


const HotelAndFacilities = () => {
  const [facilities, setFacilities] = useState([]);

  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/facilities/')
        .then(response => {
            setFacilities(response.data); 
        })
        .catch(error => {
            console.error('Error fetching facilities:', error);
        });
  }, []);

  if (facilities.length === 0) return <div>Loading facilities...</div>;


  return (
    <section className="bg-lightBlack z-[1]">
      <div className="py-[110px] bg-[url('/images/home-1/section-shape2.png')] bg-no-repeat bg-top bg-opacity-[0.07]">
        <div className="Container">
          <div
            className=" text-center mx-auto px-5 sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] "
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {/* Section logo */} 
            <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-5">
              <hr className="w-[100px] h-[1px] bg-[#3b3b3b] text-[#3b3b3b] " />
              <img
                src="/images/home-1/section-shape1.png"
                alt="room_section_logo"
                className="w-[50px] h-[50px]"
              />
              <hr className="w-[100px] h-[1px] bg-[#3b3b3b] text-[#3b3b3b] " />
            </div>
            <h1 className="text-2xl md:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px] 2xl:leading-[52px] text-white mb-[6px] font-Garamond font-semibold uppercase">
              HOTEL’S FACILITIES
            </h1>
            <p className="font-Lora leading-[26px] text-lightGray font-normal text-sm sm:text-base">
              Proactively morph optimal infomediaries rather than accurate
              expertise. Intrinsicly progressive resources rather than
              resource-leveling
            </p>
          </div>
          {/* HOTEL’S FACILITIES content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 pt-[60px] pb-[110px] w-full">
        {facilities.slice(0,6).map((facility, index) => (
          <div 
            key={index} 
            className="h-[200px] w-[197px] pt-[37px] pb-[27px] border border-[#343434] text-center transition-all duration-500 relative z-[1] group facility-card"
            style={{
              '--facility-before-bg': `url(${facility.image})`
            }}
          >
              <div className='flex items-center justify-center'>
                <img
                  src={facility.icon} 
                  alt={facility.name}
                  className="w-[50px] h-[50px]"
                />
              </div>
              <div className="">
                <h4 className="text-[22px] leading-[52px] font-Garamond text-white font-medium mt-[45px] relative before:absolute before:w-[1px] before:h-[25px] before:left-[50%] before:top-[-27px] before:bg-slate-500 before:group-hover:bg-khaki">
                  {facility.name}
                </h4>
              </div>
              <style jsx>{`
                .facility-card::before {
                  content: '';
                  position: absolute;
                  width: 0;
                  height: 100%;
                  left: 0;
                  top: 0;
                  background-image: var(--facility-before-bg);
                  background-size: cover;
                  background-position: center;
                  transition: all 0.5s;
                  z-index: 1;
                }
                .facility-card:hover::before {
                  width: 100%;
                }
                @media (min-width: 768px) {
                  .facility-card:hover::before {
                    width: 100%;
                  }
                }
                @media (min-width: 1280px) {
                  .facility-card::before {
                    right: -222px;
                  }
                  .facility-card:hover::before {
                    width: 100%;
                  }
                }
                @media (min-width: 1920px) {
                  .facility-card::before {
                    left: -222px;
                  }
                }
              `}</style>
            </div>
          ))}               
        </div>

        </div>
      </div>
    </section>
  );
};

export default HotelAndFacilities;



