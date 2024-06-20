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
  <Sidebar  className='bg-[#1e1d1d] text-white  fixed dark:bg-mediumBlack dark:text-red-500  '>
      <Sidebar.Items>
        <Sidebar.ItemGroup className="dark:bg-mediumBlack dark:text-green-900 ">
          <Sidebar.Item href="#" icon={HiChartPie} className="text-3xl font-bold mb-10 font-Garamond">
            Backoffice
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={FaHome} label="1" labelColor="dark" onClick={() => setCurrentComponent("Home")} className={`${currentComponent === "Home" ? "bg-white text-black " : ""} font-Garamond`}>
            Home
          </Sidebar.Item>
          <Sidebar.Item href="#" label="3" icon={FaBed} onClick={() => setCurrentComponent("Rooms")} className={`${currentComponent === "Rooms" ? "bg-white text-black" : ""} font-Garamond`} >
            Rooms
          </Sidebar.Item>
          <Sidebar.Item href="#" label="4" icon={IoIosPricetags} onClick={() => setCurrentComponent("Pricing")} className={`${currentComponent === "Pricing" ? "bg-white text-black" : ""} font-Garamond`} >
            Pricing
          </Sidebar.Item>
          <Sidebar.Item href="#" label="5" icon={AiOutlineBlock} onClick={() => setCurrentComponent("Blog")} className={`${currentComponent === "Blog" ? "bg-white text-black" : ""} font-Garamond`} >
            Blog
          </Sidebar.Item>
          <Sidebar.Item href="#" label="6" icon={MdOutlineContactPhone} onClick={() => setCurrentComponent("Contact")} className={`${currentComponent === "Contact" ? "bg-white text-black" : ""} font-Garamond`} >
            Contact
          </Sidebar.Item>
          <Sidebar.Item href="#" label="7" icon={HiTable } onClick={() => setCurrentComponent("Footer")} className={`${currentComponent === "Footer" ? "bg-white text-black" : ""} font-Garamond`} >
            Footer
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};


export default Sidebarr;

