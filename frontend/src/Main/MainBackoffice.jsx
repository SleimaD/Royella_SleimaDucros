import { Outlet } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import Navbar from "../Shared/Navbar/Navbar";
import ScrollToTop from "../ScrollToTop";
import GoToTop from "../Shared/GoToTop";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HelmetChanger from "../Shared/Helmet/Helmet";
import NavbarBackoffice from "../Shared/Navbar/NavbarBackoffice";

const MainBackoffice = () => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-10 ">
      {/* <HelmetChanger title="Hotel Booking" />
      <ScrollToTop />
      <GoToTop />*/}
      <NavbarBackoffice /> 
      <div className="w-full mt-[8rem]">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default MainBackoffice;
