import { Link, NavLink, useNavigate} from "react-router-dom";
import useScrollPosition from "./useScrollPosition";
import { FaBars, FaCaretDown  } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BiChevronDown, BiSun } from "react-icons/bi";
import { IoSettingsSharp, IoSettingsOutline } from "react-icons/io5";
import { IoMoonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useAuth } from "./../../RolesRoutes/AuthProvider";
import { ImProfile } from "react-icons/im";
import { IoMdSettings } from "react-icons/io";
import { FaUsersGear } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { MdBookmarks } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import { BiLogOut } from "react-icons/bi";
import { VscFeedback } from "react-icons/vsc";




const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  }


  // modal openar
  const [isOpen, setIsOpen] = useState(false);
  // dark mode toggle bar
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  // scrolling tracker
  const scrollPosition = useScrollPosition();
  // background color add and remover
  const navbarBgColor =
    scrollPosition > 100 ? "lg:bg-lightBlack" : "lg:bg-[#9a99999e]";

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getImageUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http")) return photo;
    return `http://127.0.0.1:8000${photo}`;
  };

  return (
    <nav
      className={` w-full lg:fixed font-Lora z-10  lg:px-5 lg:py-2  transition-all duration-300 ${navbarBgColor} `}
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
                {/* modal open and close */}
                {isOpen ? (
                  <IoMdClose className="w-6 h-6 text-white" />
                ) : (
                  <FaBars className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
          {/* All navLink are hear with active */}
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
                Home
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
              About
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
                Rooms 
              </NavLink>
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
                        PRICING
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
              Contact
            </NavLink>
          </ul>

          {/* large device visible button and search icon */}
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
            <Link to="/find_room">
              <button className="btn-secondary ">Booking Online</button>
            </Link>

            {user ? (
              <div className="relative flex items-center p-3">
              <img
                src={getImageUrl(user.photo)}
                alt="User Avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              <FaCaretDown
                className="ml-2 cursor-pointer text-white"
                onClick={toggleDropdown} 
              />
              {dropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 py-2 px-3 w-[15rem] bg-[#131212dd] text-white backdrop-blur-sm  rounded-md shadow-xl z-50 flex  flex-col gap-3 ">
                  <div className="block px-4 py-2 text-lg text-gray-700 font-bold font-Garamond">{user.username} <small>({user.role})</small></div>
                  <NavLink
                    to="/profile"
                    className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                  >
                     <ImProfile className="text-khaki" /> Profile
                  </NavLink>
                  {user.role === 'Admin' && (
                    <div className="flex flex-col gap-2">
                      <NavLink
                      to="/backoffice"
                      className=" px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                    >
                      <IoMdSettings size={19} className="text-khaki" /> Backoffice
                    </NavLink>
                    <NavLink
                      to="/useraccounts"
                      className=" px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                    >
                      <FaUsersGear size={19} className="text-khaki" /> User Accounts
                    </NavLink> 
                    </div>
                    
                  )}
                  {(user.role === 'Admin' || user.role === 'Webmaster')  && (
                    <NavLink
                      to="/mailbox"
                      className=" px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                    >
                      <IoMdMail size={19} className="text-khaki" /> Mailbox
                    </NavLink>
                  )}
                  {(user.role === 'Receptionist' || user.role === 'Utilisateur' || user.role === 'Admin' || user.role === 'Webmaster')  && (
                    <NavLink
                      to="/reservations"
                      className=" px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-1 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                    >
                       <MdBookmarks size={19} className="text-khaki" /> Reservations
                    </NavLink>
                  )}
                  {(user.role === 'Webmaster' || user.role === 'Redacteur' || user.role === 'Admin')  && (
                    <NavLink
                      to="/blogmanagement"
                      className=" px-[0.6rem] py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                    >
                      <TfiWrite size={19} className="text-khaki" /> Blog Management
                    </NavLink>
                  )}
                  {(user.role === 'Webmaster')  && (
                    <NavLink
                      to="/testimonialmanager"
                      className=" px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                    >
                      <VscFeedback size={19} className="text-khaki" /> Testimonial Management
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className=" w-full text-left px-3 py-2 mt-5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 hover:bg-[#f8f6f3] hover:transition-all  transition-all duration-300 hover:text-black"
                  >
                    <BiLogOut size={20} className="text-khaki" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <NavLink to="/login" className="p-3 text-white">Sign In</NavLink>
              <NavLink to="/register" className="p-3 text-white">Sign Up</NavLink>
            </div>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
