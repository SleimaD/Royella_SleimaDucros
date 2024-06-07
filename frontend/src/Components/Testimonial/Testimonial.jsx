import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "../../Components4/Testimonial/testimonials.css";
import "keen-slider/keen-slider.min.css";
import axios from "axios";

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [sliderRef, instanceRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 600px)": {
        slides: { perView: 1, spacing: 20 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 20 },
      },
    },
    loop: true,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      // setLoaded(true);
    },
  });



  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/testimonials/");
        const allTestimonials = response.data;
        const shuffled = allTestimonials.sort(() => 0.5 - Math.random());
        const selectedTestimonials = shuffled.slice(0, 2);
        setTestimonials(selectedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);




  return (
    <section className="sectiontesti bg-[url('/images/home-1/logo-1.png')] bg-center  bg-[rgba(30,30,30,0.4)] dark:bg-[rgba(30,30,30,0.6)] bg-opacity-40 grid items-center justify-center bg-no-repeat bg-cover">
      <div className="Container py-20 lg:py-[120px]">
        {/* section title */}
        <div
          className="text-center sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px]  2xl:px-[335px] mx-auto px-5"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Section logo */}
          <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-5">
            <hr className="w-[100px] h-[1px]  text-[#473f39] " />
            <img
              src="/images/home-1/section-shape1.png"
              alt="room_section_logo"
              className="w-[50px] h-[50px]"
            />
            <hr className="w-[100px] h-[1px]  text-[#473f39] " />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] 2xl:leading-[52px] text-white mt-[20px] mb-[16px] font-Garamond font-semibold uppercase">
            Customer’s Testimonials
          </h1>
          <p className="font-Lora leading-7 lg:leading-[26px] text-white font-normal text-sm sm:text-base">
            Proactively morph optimal infomediaries rather than accurate
            expertise. Intrinsicly progressive resources rather than
            resource-leveling
          </p>
        </div>

        {/* very small screen Show and 567px hidden */}
        <div
          className="mt-14 sm:hidden px-1"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Small device show one testimonials section */}
          {testimonials.map((testimonial, index) => (
            <div className="py-[10px] pt-4 sm:hidden flex flex-wrap justify-center items-center gap-5" key={index}>
              <div className="bg-white dark:bg-normalBlack p-5 md:p-10 relative before:absolute before:w-[85%]  before:h-[10px] before:bg-khaki before:mx-auto before:-top-[10px] before:left-0 before:right-0 after:absolute after:w-[85%] after:h-[10px] after:bg-khaki after:mx-auto after:-bottom-[10px] after:left-0 after:right-0 sm:hidden">
                {/* quote icon */}
                <img
                  src="/images/home-1/testi-quote.png"
                  alt=""
                  className="absolute  right-3 xl:right-10 -top-8"
                />

                {/* rating icon */}
                <ul className="flex items-center text-khaki justify-center gap-7 w-full">
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

                <div className="flex items-center space-x-6 ">
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
              </div>
            </div>
          ))}
        </div>

        {/* testimonial */}
        <div
          className="mt-14 2xl:mt-[60px] relative keen-slider  hidden sm:block w-full "
          ref={sliderRef}
        >
          {testimonials.map((testimonial, index) => (
            <div
              className="keen-slider__slide number-slide1 hidden sm:block mx-4 "
              key={index}
            >
              <div
                className="py-[10px] pt-10 hidden sm:block"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <div className="bg-white dark:bg-normalBlack p-5 md:p-10 relative before:absolute before:w-[85%]  before:h-[10px] before:bg-khaki before:mx-auto before:-top-[10px] before:left-0 before:right-0 after:absolute after:w-[85%] after:h-[10px] after:bg-khaki after:mx-auto after:-bottom-[10px] after:left-0 after:right-0 hidden sm:block">
                  {/* quote icon */}
                  <img
                    src="/images/home-1/testi-quote.png"
                    alt=""
                    className="absolute  right-3 xl:right-10 -top-8"
                  />

                  {/* rating icon */}
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

                  <div className="flex items-center space-x-6 ">
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
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* slide changer */}
        <div className="mx-auto  ">
          {loaded && instanceRef.current && (
            <div className="dots flex items-center justify-center">
              {[
                ...Array(
                  instanceRef.current.track.details.slides.length
                ).keys(),
              ].map((idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={"dot" + (currentSlide === idx ? " active" : "")}
                  ></button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
