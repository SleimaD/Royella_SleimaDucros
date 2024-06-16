import React, { useState, useEffect } from 'react'
import Action from './ComponentsBack/Home/ActionBack';
import Sidebarr from './ComponentsBack/SideBar/SideBar';
import "./ComponentsBack/SideBar/SideBar.css";
import "./../../index.css"
import Home from './ComponentsBack/Home/Home';
import About from './ComponentsBack/About/About';
import RoomsBack from './ComponentsBack/Rooms/RoomsBack';
import PricingBack from './ComponentsBack/Pricing/PricingBack';
import BlogBack from './ComponentsBack/Blog/BlogBack';
import Contact from './ComponentsBack/Contact/Contact';
import Footer from './ComponentsBack/Footer/Footer';


function Backoffice() {
  const [currentComponent, setCurrentComponent] = useState("Home");

  const renderComponent = () => {
    switch(currentComponent) {
      case "Home": return <Home />;
      // case "About": return <About />;
      case "Rooms": return <RoomsBack />;
      case "Pricing": return <PricingBack />;
      case "Blog": return <BlogBack />;
      case "Contact": return <Contact />;
      case "Footer": return <Footer />;
      default: return <Home />;
    }
  };

  return (
  <div className='flex w-full h-screen overflow-x-hidden'>
      <div className="w-[20%] h-full ">
        <Sidebarr setCurrentComponent={setCurrentComponent} currentComponent={currentComponent} />
      </div>      
      <div className="transition-opacity duration-1000 ease-in-out flex-grow p-2 w-[80%] flex mt-5">
        {renderComponent()}
      </div>
    </div>
  )
}

export default Backoffice


