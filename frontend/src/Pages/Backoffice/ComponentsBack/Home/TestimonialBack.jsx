import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import Swal from 'sweetalert2';

const TestimonialBack = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/testimonials/");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const deleteTestimonial = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/testimonials/${id}/`);
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
      Swal.fire({
        title: 'Deleted!',
        text: 'The testimonial has been deleted.',
        icon: 'success',
        confirmButtonColor: '#008000',
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the testimonial.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <section className="sectiontesti bg-[url('/images/home-1/logo-1.png')] bg-center bg-[rgba(30,30,30,0.4)] dark:bg-[rgba(30,30,30,0.6)] bg-opacity-40 grid items-center justify-center bg-no-repeat bg-cover">
      <div className="Container py-20 lg:py-[120px]">
        <div className="text-center">
          <div className="flex items-center flex-wrap justify-center space-x-2 mb-4 lg:mb-5">
            <hr className="w-[100px] h-[1px] text-[#473f39]" />
            <img
              src="/images/home-1/section-shape1.png"
              alt="room_section_logo"
              className="w-[50px] h-[50px]"
            />
            <hr className="w-[100px] h-[1px] text-[#473f39]" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] 2xl:leading-[52px] text-white mt-[20px] mb-[16px] font-Garamond font-semibold uppercase">
            Customer’s Testimonials
          </h1>
        </div>

        <div className="mt-14 flex flex-wrap justify-center items-center gap-6">
          {testimonials.map((testimonial, index) => (
            <div className="w-full md:w-1/2 lg:w-1/3  p-5" key={index}>
              <div className="bg-white dark:bg-normalBlack p-5 md:p-10 relative before:absolute before:w-[85%] before:h-[10px] before:bg-khaki before:mx-auto before:-top-[10px] before:left-0 before:right-0 after:absolute after:w-[85%] after:h-[10px] after:bg-khaki after:mx-auto after:-bottom-[10px] after:left-0 after:right-0">
                <img
                  src="/images/home-1/testi-quote.png"
                  alt=""
                  className="absolute right-3 xl:right-10 -top-8"
                />
                <ul className="flex items-center text-khaki space-x-[4px]">
                  {Array(testimonial.rating)
                    .fill()
                    .map((_, i) => (
                      <li key={i}>
                        <FaStar size={"16px"} />
                      </li>
                    ))}
                </ul>
                <p className="font-Lora text-sm sm:text-base leading-[26px] text-gray dark:text-lightGray font-normal xl:text-lg mt-[30px] italic mb-[45px] before:absolute before:h-[30px] before:left-0 before:bottom-[-36px] before:bg-khaki before:w-[1px] relative">
                  “{testimonial.feedback}”
                </p>
                <span className="w-[1px] h-[25px] bg-[#ddd]"></span>
                <div className="flex items-center space-x-6">
                  <img
                    src={testimonial.image}
                    className="w-[65px] h-[65px]"
                    alt=""
                  />
                  <div className="">
                    <h4 className="text-base lg:text-[22px] leading-[26px] text-lightBlack dark:text-white font-semibold font-Garamond">
                      {testimonial.name}
                    </h4>
                    <p className="pt-1 text-sm md:text-base leading-[26px] font-normal text-gray dark:text-lightGray flex items-center">
                      <span className="w-5 h-[1px] inline-block text-khaki bg-khaki mr-2"></span>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => deleteTestimonial(testimonial.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialBack;
