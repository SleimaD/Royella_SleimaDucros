import { Link, NavLink } from "react-router-dom";
import useScrollPosition from "./useScrollPosition";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiChevronDown, BiSun } from "react-icons/bi";
import { IoMoonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";

const Navbar = () => {
  // modal openar
  const [isOpen, setIsOpen] = useState(false);
  // dark mode toggle bar
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  // scrolling tracker
  const scrollPosition = useScrollPosition();
  // background color add and remover
//   const navbarBgColor =
//     scrollPosition > 100 ? "lg:bg-lightBlack" : "lg:bg-[#000]";

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

//   className={` w-full lg:fixed font-Lora z-10  lg:px-5 lg:py-2  transition-all duration-300 ${navbarBgColor} `} 


  return (
    <nav
      className={` w-full lg:fixed font-Lora z-10  lg:px-5 lg:py-2  transition-all duration-300 bg-[#000] text-white `}
    >
      <div className="lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* website Logo */}
          <div className=" w-48 lg:w-52 lg:p-4 ">
            <Link to="/">
              <img
                src="/images/home-3/logo.png"
                className="hidden lg:block w-full"
                alt="website_logo"
              />
            </Link>
          </div>
          {/* small screen size */}
          <div className="px-3 w-full lg:hidden flex justify-between text-lightBlack lg:text-white dark:text-white bg-khaki h-[70px]  items-center  p-3">
            <div className=" w-28  ">
              <Link to="/">
                <img
                  src="/images/home-1/brand-1.png"
                  className="block lg:hidden "
                  alt="Royella_website_logo"
                />
              </Link>
            </div>

            {/* toggle bar and dark and light mode. */}
            <div className="flex items-center ">
              <span onClick={handleClick} className="mr-3 cursor-pointer">
                {isDarkMode ? (
                  <BiSun
                    className="text-white"
                    title="Apply Light Mode"
                    size={20}
                  />
                ) : (
                  <IoMoonSharp
                    size={20}
                    className="text-white"
                    title="Apply Dark Mode"
                  />
                )}
              </span>
              <button
                className="lg:hidden block focus:outline-none "
                onClick={toggleNavbar}
              >
                {isOpen ? (
                  <IoMdClose className="w-6 h-6 text-white" />
                ) : (
                  <FaBars className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
          <ul
            className={`${
              isOpen ? "block" : "hidden"
            } text-left w-full lg:w-fit  ease-in-out lg:flex space-y-2 lg:space-y-0 lg:text-center space-x-0 lg:space-x-3 xl:space-x-4 2xl:space-x-5 3xl:space-x-[24px] flex flex-col lg:flex-row text-sm text-lightBlack lg:text-white dark:text-white uppercase font-normal bg-white dark:bg-normalBlack lg:bg-transparent dark:lg:bg-transparent py-3 lg:py-0 `}
          >
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative`}
              to="/"
            >
              <span className="flex items-center">
                Back-Home
              </span>
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300`}
              to="/about"
            >
              back-About
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative `}
              to="#"
            >
              <span className="flex items-center justify-center">
              <NavLink to="/find_room" className="block ">
                Back-Room 
              </NavLink>
                {/* <BiChevronDown className="ml-1" /> */}
              </span>
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active" 
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative `}
              to="#"
            >
              <span className="flex items-center">
              <NavLink to="/pricing" className="block">
                        Back-PRICING
                      </NavLink>
                {/* <BiChevronDown className="ml-1" /> */}
              </span>
            </NavLink>
            {/* blog sub menu link */}
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white  lg:border-b-0 px-3 py-2 w-full block transition-all duration-300 group relative `}
              to="#"
            >
              <span className="flex items-center">
              <NavLink to="/blog" className="block">
                        BLOG
              </NavLink>
              </span>
            </NavLink>
            <NavLink
              className={`${({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "active"
                  : ""} text-lightBlack lg:text-white dark:text-white lg:border-b-0 px-3 py-2 w-full block transition-all duration-300`}
              to="/contact"
            >
              Back-Contact
            </NavLink>
          </ul>

          <div className="hidden lg:flex items-center">
            <span onClick={handleClick} className="mr-3 cursor-pointer group ">
              {isDarkMode ? (
                <BiSun
                  className="text-white group-hover:rotate-90 rotate transition-all duration-300"
                  title="Apply Light Mode"
                  size={35}
                />
              ) : (
                <IoMoonSharp
                  className="text-white group-hover:rotate-[360deg] transition-all duration-300"
                  title="Apply Dark Mode"
                  size={35}
                />
              )}
            </span>
            {/* <Link to="/find_room">
              <button className="btn-secondary ">Booking Online</button>
            </Link> */}
            <NavLink to="/" className="p-3">
                Home
            </NavLink>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
