import React, { useState, useEffect } from 'react'
import Action from './ComponentsBack/Home/ActionBack';
import Sidebarr from './ComponentsBack/SideBar/SideBar';
import "./ComponentsBack/SideBar/SideBar.css";
import "./../../index.css"
import Home from './ComponentsBack/Home/Home';
import About from './ComponentsBack/About/AboutBack';
import RoomsBack from './ComponentsBack/Rooms/RoomsBack';
import PricingBack from './ComponentsBack/Pricing/PricingBack';
import BlogBack from './ComponentsBack/Blog/BlogBack';
import ContactBack from './ComponentsBack/Contact/ContactBack';
import FooterBack from './ComponentsBack/Footer/FooterBack';


function Backoffice() {
  const [currentComponent, setCurrentComponent] = useState("Home");

  const renderComponent = () => {
    switch(currentComponent) {
      case "Home": return <Home />;
      case "About": return <About />;
      case "Rooms": return <RoomsBack />;
      case "Pricing": return <PricingBack />;
      case "Blog": return <BlogBack />;
      case "Contact": return <ContactBack />;
      case "Footer": return <FooterBack />;
      default: return <Home />;
    }
  };

  return (
  <div className='flex w-full h-screen overflow-x-hidden dark:bg-mediumBlack dark:text-white '>
      <div className="w-[20%] h-full ">
        <Sidebarr setCurrentComponent={setCurrentComponent} currentComponent={currentComponent} />
      </div>      
      <div className="transition-opacity duration-1000 ease-in-out  p-5 w-[83%] flex dark:bg-mediumBlack dark:text-white ">
        {renderComponent()}
      </div>
    </div>
  )
}

export default Backoffice


