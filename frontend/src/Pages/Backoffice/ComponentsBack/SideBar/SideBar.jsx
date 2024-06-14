import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { FaHome, FaBed } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
import { MdOutlineContactPhone } from "react-icons/md";
import { AiOutlineBlock } from "react-icons/ai";
import { FcAbout } from "react-icons/fc";



const Sidebarr = ({ setCurrentComponent, currentComponent }) => {
  return (
  <Sidebar  className='bg-[#1e1d1d] text-white mt-10 fixed rounded-r-xl '>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie} className="text-3xl font-bold mb-10">
            Backoffice
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={FaHome} label="1" labelColor="dark" onClick={() => setCurrentComponent("Home")} className={currentComponent === "Home" ? "bg-white text-black " : ""}>
            Home
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={FcAbout} label="2" onClick={() => setCurrentComponent("About")}
            className={currentComponent === "About" ? "bg-white text-black" : ""}>
            About
          </Sidebar.Item>
          <Sidebar.Item href="#" label="3" icon={FaBed} onClick={() => setCurrentComponent("Rooms")} className={currentComponent === "Rooms" ? "bg-white text-black" : ""} >
            Rooms
          </Sidebar.Item>
          <Sidebar.Item href="#" label="4" icon={IoIosPricetags} onClick={() => setCurrentComponent("Pricing")} className={currentComponent === "Pricing" ? "bg-white text-black" : ""} >
            Pricing
          </Sidebar.Item>
          <Sidebar.Item href="#" label="5" icon={AiOutlineBlock} onClick={() => setCurrentComponent("Blog")} className={currentComponent === "Blog" ? "bg-white text-black" : ""} >
            Blog
          </Sidebar.Item>
          <Sidebar.Item href="#" label="6" icon={MdOutlineContactPhone} onClick={() => setCurrentComponent("Contact")} className={currentComponent === "Contact" ? "bg-white text-black" : ""} >
            Contact
          </Sidebar.Item>
          <Sidebar.Item href="#" label="7" icon={HiTable } onClick={() => setCurrentComponent("Footer")} className={currentComponent === "Footer" ? "bg-white text-black" : ""} >
            Footer
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};


export default Sidebarr;

