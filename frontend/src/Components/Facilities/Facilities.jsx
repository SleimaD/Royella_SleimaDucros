import { HiArrowLongRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Facilities = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/services/");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);


  return (
    <div className="dark:bg-mediumBlack ">
      <section className="Container py-[120px] md:py-0 md:pb-[120px] lg:py-[120px]">
        {/* section title and button */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between mb-12 px-3 sm:px-5"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div className=" md:w-[450px] font-Garamond">
            <h5 className="text-base text-khaki leading-[26px] font-medium mb-[14px]  ">
              FACILITIES
            </h5>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[38px] lg:leading-[44px]  text-lightBlack dark:text-white font-semibold ">
              ENJOY COMPLETE & BEST QUALITY FACILITIES
            </h1>
          </div>
          <div className="mt-5 md:mt-0">
            <Link to="/services">
              <button className="btn-items">view more item</button>
            </Link>
          </div>
        </div>
        {/* facilities container */}
        <div className="">

        {services.map((service, index) => (
            <div key={service.id}>
              <hr className="text-[#e8e8e8] dark:text-[#383838] mb-10 mt-10" />
              <div
                className="grid grid-cols-1 md:grid-cols-2 "
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="relative w-full h-[100%] md:pr-[30px]">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full"
                      />
                      <div className=" hidden md:block absolute -top-[0px] md:-right-[12%] -right-[7%] xl:-right-[5%]">
                        <h2 className="text-3xl md:text-4xl lg:text-[40px] leading-[38px] text-khaki font-Garamond">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </h2>
                      </div>
                    </div>
                    <div className="relative font-Garamond md:ml-[60px] lg:ml-[107px] mt-3 md:mt-0  h-full">
                      <h4 className="text-base font-semibold text-khaki leading-[26px] pb-[6px] uppercase mt-2 md:mt-0">
                        {service.subtitle}
                      </h4>
                      <h1 className="text-2xl md:text-3xl 2xl:text-[32px] leading-[26px] font-semibold text-lightBlack dark:text-white">
                        <Link to={`/service_details/${service.id}`}>
                          {service.title}
                        </Link>
                      </h1>
                      <p className="font-Lora text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] font-normal my-10 lg:mt-[46px] lg:mb-[40px] before:absolute before:h-[30px] before:left-0 before:top-[-35px] before:bg-[#ddd] before:w-[1px] relative">
                        {service.description}
                      </p>
                      <Link to={`/service_details/${service.id}`}>
                        <HiArrowLongRight
                          size={30}
                          className="text-gray hover:text-khaki"
                        />
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className=" font-Garamond md:mr-[2px] lg:mr-[110px]  h-full">
                      <h4 className="text-base font-semibold text-khaki leading-[26px] pb-[6px] uppercase ">
                        {service.subtitle}
                      </h4>
                      <h1 className="text-2xl md:text-3xl 2xl:text-[32px] leading-[26px] font-semibold text-lightBlack dark:text-white">
                        <Link to={`/service_details/${service.id}`}>
                          {service.title}
                        </Link>
                      </h1>
                      <p className="font-Lora relative text-sm sm:text-base text-gray dark:text-lightGray leading-[26px] font-normal my-10 lg:mt-[46px] lg:mb-[40px] before:absolute before:h-[30px] before:left-0 before:top-[-35px] before:bg-[#ddd] before:w-[1px]">
                        {service.description}
                      </p>
                      <Link to={`/service_details/${service.id}`}>
                        <HiArrowLongRight
                          className="text-gray hover:text-khaki"
                          size={30}
                        />
                      </Link>
                    </div>
                    <div className="w-full  md:pl-[30px] relative mt-5 md:mt-0">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full"
                      />
                      <div className="hidden md:block absolute -top-[0px] -left-[12%] xl:-left-[6%]">
                        <h1 className="text-3xl md:text-4xl lg:text-[40px] leading-[38px] text-khaki  font-Garamond">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </h1>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}          
        </div> 
      </section>
    </div>
  );
};

export default Facilities;
