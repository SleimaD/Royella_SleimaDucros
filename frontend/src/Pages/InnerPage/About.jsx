import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import {
  BsArrowRight,
  BsChevronLeft,
  BsChevronRight,
  BsPlay,
  BsTwitter,
} from "react-icons/bs";
import { FaFacebookF, FaLinkedinIn, FaPinterestP, FaStar } from "react-icons/fa6";
import { useState, useEffect } from "react";
import "../../Components4/Testimonial/testimonials.css";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Link } from "react-router-dom";
import FsLightbox from "fslightbox-react";
import axios from "axios";


const About = () => {
  const [setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [toggler, setToggler] = useState(false);
  const [members, setMembers] = useState([]);
  const [manager, setManager] = useState({});
  const [sliderRef] = useKeenSlider({
    breakpoints: {
      "(min-width: 320px)": {
        slides: { perView: 1, spacing: 20 },
      },
      "(min-width:768px)": {
        slides: { perView: 2, spacing: 20 },
      },
      "(min-width:992px)": {
        slides: { perView: 3, spacing: 20 },
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
        const selectedTestimonials = shuffled.slice(0, 3); 
        setTestimonials(selectedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/members/");
        const allMembers = response.data;
        const designatedMember = allMembers.find(member => member.is_designated);
        const otherMembers = allMembers.filter(member => !member.is_designated);
        const shuffled = otherMembers.sort(() => 0.5 - Math.random());
        const selectedMembers = [shuffled[0], designatedMember, shuffled[1]];
        setMembers(selectedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  const [latestBlogs, setLatestBlogs] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/blogs/latest/')
      .then(response => response.json())
      .then(data => setLatestBlogs(data))
      .catch(error => console.error('Error fetching latest blogs:', error));
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/managers/') 
        .then(response => {
            if (response.data && response.data.length > 0) {
                setManager(response.data[0]);  
                console.log("Video URL:", response.data[0].video_url); 
                console.log(response.data[0]);
            }
        })
        .catch(error => {             
            console.error('There was an error!', error);
        });
  }, []);


  const [hotelInfo, setHotelInfo] = useState({
    title: '',
    subtitle: '',
    description: '',
    room_count: 0,
    customer_rating: 0,
    image: '',
  });

  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/hotels/1/');
        setHotelInfo(response.data);
      } catch (error) {
        console.error('Error fetching hotel info:', error);
      }
    };

    fetchHotelInfo();
  }, []);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/contact-info/1/');
        setContactInfo(response.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchContactInfo();
  }, []);


  if (!manager || Object.keys(manager).length === 0) return <div>Loading...</div>;
  if (!hotelInfo || Object.keys(hotelInfo).length === 0) return <div>Loading...</div>;
  if (!contactInfo || Object.keys(contactInfo).length === 0) return <div>Loading...</div>;


  return (
    <section className="">
      <BreadCrumb title="About Us" pageName="about" />
      
      {/* about content */}
      <section className="dark:bg-mediumBlack">
        <div className="Container py-20 2xl:py-[120px] sm:overflow-hidden lg:overflow-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* image */}
            <div
              className="flex-1"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <img
                src={hotelInfo.image}
                alt=""
                className="w-full h-full"
              />
            </div>

            {/* text */}
            <div
              className="mt-10 md:mt-0 md:ml-10 lg:ml-[90px] 2xl:ml-[100px] font-Garamond space-y-3 xl:space-y-4 flex-1"
              data-aos="zoom-in-down"
              data-aos-duration="1000"
            >
              <h5 className="text-base text-khaki leading-[26px] font-medium">
                {hotelInfo.subtitle}
              </h5>
              <h1 className="text-[22px] sm:text-2xl md:text-[21px]  xl:text-3xl 2xl:text-[38px] leading-6 md:leading-7 lg:leading-[30px] 2xl:leading-[44px] text-lightBlack dark:text-white font-semibold my-4">
                {hotelInfo.title}
              </h1>
              <p className="text-sm xl:text-base md:text-sm lg:text-base font-Lora text-gray dark:text-lightGray font-normal leading-[26px]">
                {hotelInfo.description}
              </p>


              <div className="bg-whiteSmoke dark:bg-lightBlack px-[30px] py-5">
                <p className="text-sm sm:text-base leading-10 3xl:leading-[50px] text-lightBlack dark:text-white font-medium font-Lora ">
                  {contactInfo.address}
                </p>
              </div>
              <button className="btn-primary mt-[30px]">MORE ABOUT</button>
            </div>

            {/* text */}
          </div>
        </div>
      </section>
      {/* Hostel Facilities */}
      {/* next --> */}

      {/* best hotel manager */}
      <div className="bg-lightBlack -z-[1] py-20 2xl:py-[120px]">
        <div className="Container ">
          <div className=" w-full grid grid-cols-1 lg:grid-cols-2 items-center ">
            <div
              className="flex-1 h-[100%] w-full relative "
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <div className="flex-1 h-[100%] w-full relative ">
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
                sources={["https://youtu.be/fFDyoI73viQ?si=GbDzAagjoa_0Nv2x"]}
              />
            </div>
            <div
              className="bg-[#f8f6f3] dark:bg-normalBlack space-y-5 flex-1 font-Garamond px-5 sm:px-7 md:px-9 lg:pl-[70px] py-10 md:py-[96px] lg:pr-[70px]"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
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
          </div>
        </div>
      </div>

      {/* Expert Members */}
      <div className="dark:bg-normalBlack py-20 2xl:py-[120px]">
        <div className="Container">
          {/* section header */}
          <div
            className="text-center sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px] mx-auto px-5 Container"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {/* Section logo */}
            <div className="flex items-center justify-center space-x-2">
              <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray text-lightGray dark:text-gray" />
              <img
                src="/images/inner/inner-logo.png"
                alt="room_section_logo"
                className="w-[50px] h-[50px]"
              />
              <hr className="w-[100px] h-[1px] bg-lightGray dark:bg-gray text-lightGray dark:text-gray" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[42px] 2xl:leading-[52px] text-lightBlack dark:text-white mt-[10px] mb-[14px] font-Garamond font-semibold uppercase">
              MEET THE EXPERT MEMBERS
            </h1>
            <p className="font-Lora leading-7 lg:leading-[26px] text-lightGray font-normal text-sm sm:text-base">
              Proactively morph optimal infomediaries rather than accurate
              expertise. Intrinsicly progressive resources rather than
              resource-leveling
            </p>
          </div>

          {/* Section Content */}
          <div className="mt-[60px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] ">
            {members.map((member, index) => (
              <div
                key={index}
                className="member group"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <img src={member.image} className="w-full" alt={member.name} />
                <div className="relative">
                  <div className="px-4  lg:px-[30px] pt-5 ">
                    <h3 className="text-xl sm:text-2xl lg:text-2xl xl:text-[28px] leading-7 md:leading-8 lg:leading-10 text-lightBlack dark:text-white font-semibold font-Garamond text-center hover:opacity-0">
                      {member.name}
                    </h3>
                    <p className="text-sm md:text-base leading-[26px] text-Gray dark:text-lightGray font-normal font-Lora text-center group-hover:text-white dark:hover:text-white hover:opacity-0">
                      {member.position}
                    </p>
                  </div>
                  <div
                    className="p-[30px] bg-khaki grid items-center justify-center absolute bottom-[-150px] sm:bottom-[-170px] md:bottom-[-150px] group-hover:bottom-[-38px] lg:group-hover:bottom-[-30px] transition-all
                    duration-500 left-0 right-0"
                  >
                    <div className="flex items-center justify-center space-x-4 text-white">
                      {member.facebook && <a href={member.facebook}><FaFacebookF /></a>}
                      {member.twitter && <a href={member.twitter}><BsTwitter /></a>}
                      {member.linkedin && <a href={member.linkedin}><FaLinkedinIn /></a>}
                      {member.pinterest && <a href={member.pinterest}><FaPinterestP /></a>}
                    </div>
                    <p className="text-white font-medium leading-10 text-xl lg:text-[22px] font-Garamond">
                      {member.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clients Feedback */}

        <section className="bg-[#f8f6f3] dark:bg-lightBlack py-20 lg:py-[120px]">
          <div className="Container">
            {/* Section heading */}
            <div
              className="flex items-start justify-between relative"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="space-y-3 md:w-[450px] xl:w-[550px] font-Garamond">
                <h5 className="text-base text-khaki leading-[26px] font-medium">
                  LUXURY FEEDBACK
                </h5>
                <h1 className="text-[22px] sm:text-3xl 2xl:text-[38px] leading-6 md:leading-[38px] lg:leading-[44px] text-lightBlack dark:text-white font-semibold uppercase">
                  Resote clients feedback about services
                </h1>
              </div>
              <div className="hidden sm:flex items-center lg:space-x-5 space-x-3">
                <button className="lg:w-[50px] w-[30px] h-[30px] lg:h-[50px] flex items-center justify-center border-[1px] border-[#cccbc8] text-[#cccbc8] hover:bg-khaki hover:border-none group">
                  <BsChevronLeft className="w-5 h-5 text-[#cccbc8] group-hover:text-white" />
                </button>
                <button className="lg:w-[50px] w-[30px] h-[30px] lg:h-[50px] flex items-center justify-center border-[1px] border-[#cccbc8] text-[#cccbc8] hover:bg-khaki hover:border-none group">
                  <BsChevronRight className="w-5 h-5 text-[#cccbc8] group-hover:text-white" />
                </button>
              </div>
            </div>
            <hr className="w-full h-[2px] text-[#e8e8e8] dark:text-[#383838] mt-10" />

            {/* Clients Feedback */}
            <div className="relative" data-aos="zoom-in-up" data-aos-duration="1000">
              <div className="mt-[60px] keen-slider" ref={sliderRef}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="keen-slider__slide number-slide1 group mx-2">
                    <div className="bg-white h-[14rem] dark:bg-normalBlack group-hover:bg-khaki dark:hover:bg-khaki transition-all ease-in-out duration-500 p-[30px] relative before:absolute before:w-6 before:h-6 before:bg-white before:group-hover:bg-khaki dark:before:bg-normalBlack before:rotate-45 before:left-[37px] before:-bottom-[13px]">
                      <span className="flex items-center space-x-[5px] md:space-x-2 xl:space-x-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className="text-khaki group-hover:text-white"
                            size={18}
                          />
                        ))}
                      </span>
                      <p className="font-Lora text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray group-hover:text-white font-normal mt-7 p-2">
                        {testimonial.feedback}
                      </p>
                    </div>
                    <div className="flex items-center mt-10 lg:mt-[51px] p-3">
                      <img src={testimonial.image} alt={testimonial.name} className="w-[85px] h-[80px]" />
                      <div className="ml-5 md:ml-6">
                        <h4 className="text-lg sm:text-xl md:text-2xl leading-[28px] text-[#041341] dark:text-white font-medium font-Garamond">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm sm:text-base leading-7 font-Lora font-normal text-gray dark:text-lightGray">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* Latest Blog */}

      <div className=" dark:bg-normalBlack">
        <section className="Container py-20 lg:py-[120px]">
          {/* Section Header */}
          <div
            className=" text-center mx-auto  px-5 sm:px-8 md:px-[80px] lg:px-[120px] xl:px-[200px] 2xl:px-[335px]"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            {/* Section logo */}
            <div className="flex items-center justify-center space-x-2 mb-4  ">
              <hr className="w-[100px] h-[1px] text-[#dedbd4] dark:text-[#3b3b3b] " />
              <img
                src="/images/home-1/section-shape1.png"
                alt="room_section_logo"
                className="w-[50px] h-[50px]"
              />
              <hr className="w-[100px] h-[1px] text-[#dedbd4] dark:text-[#3b3b3b] " />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl 2xl:text-[38px] leading-[44px] lg:leading-[52px] text-lightBlack dark:text-white  font-Garamond font-semibold uppercase mb-[8px]">
              LATEST POST FROM BLOG
            </h1>
            <p className="font-Lora leading-[26px] text-gray dark:text-lightGray font-normal text-sm sm:text-base">
              Proactively morph optimal infomediaries rather than accurate
              expertise. Intrinsicly progressive resources rather than
              resource-leveling
            </p>
          </div>
          {/* all blogs are here */}
          <div className="relative">
            <div className="mt-14 2xl:mt-[60px] keen-slider" ref={sliderRef}>
              {latestBlogs.map((blog, index) => (
                <div key={index} className="keen-slider__slide number-slide1">
                  <div
                    className="overflow-hidden 3xl:w-[410px] group"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <div className="relative">
                      <img
                        src={blog.image}
                        className="w-full h-[300px] object-cover"
                        alt={blog.title}
                      />
                    </div>
                    <div className="font-Garamond border border-[#e8e8e8] dark:border-[#424242] border-t-0">
                      <div className="py-6 px-[30px] lg:px-5 xl:px-[25px]">
                        <div className="flex items-center space-x-6">
                          <p className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal uppercase mr-7 ml-3 relative before:absolute before:w-[7px] before:h-[7px] before:left-[-13px] before:bg-[#d1d1d1] dark:before:bg-khaki before:top-[9px]">
                            {new Date(blog.posted_on).toLocaleDateString()}
                          </p>
                          <p className="text-sm lg:text-base leading-[26px] text-gray dark:text-lightGray font-normal uppercase mr-7 ml-3 relative before:absolute before:w-[7px] before:h-[7px] before:left-[-13px] before:bg-[#d1d1d1] dark:before:bg-khaki before:top-[9px]">
                            {blog.category.map(cat => cat.name).join(', ')}
                          </p>
                        </div>
                        <Link to="/blog_details" state={{ blog }}>
                          <button className="text-xl sm:text-[22px] xl:text-2xl text-left 2xl:text-[26px] leading-[34px] font-semibold text-lightBlack dark:text-white py-2 sm:py-3 md:py-4 hover:underline underline-offset-2">
                            {blog.title}
                          </button>
                        </Link>
                      </div>
                      <div className="border-t-[1px] border-[#e8e8e8] dark:border-[#424242] py-2 lg:py-3">
                        <Link to="/blog_details" state={{ blog }} className="px-[30px] flex items-center justify-between">
                          <button className="text-sm sm:text-base flex items-center">
                            <span className="ml-[10px] leading-[38px] uppercase text-lightBlack dark:text-white font-medium group-hover:text-khaki hover:underline underline-offset-1">
                              Read More
                            </span>
                          </button>
                          <div>
                            <BsArrowRight className="text-gray dark:text-lightGray group-hover:text-khaki" size={"24px"} />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
