import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BreadCrumb = ({ title, pageName }) => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/banners/");
        const banners = response.data;
        const currentBanner = banners.find(banner => banner.page_name === pageName);
        if (currentBanner) {
          setBanner(currentBanner);
        } else {
          console.error(`No banner found for page: ${pageName}`);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanner();
  }, [pageName]);

  if (!banner) {
    return null; 
  }

  return (
    <section
      className="w-full relative h-[750px] bg-center grid items-center justify-center"
      >
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-[-1]"
        style={{
          backgroundImage: `url(${banner.image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "brightness(0.4)" 
        }}
      />     
       <div className="mt-10 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl leading-10 lg:leading-[60px] 2xl:leading-[70px] text-white font-semibold font-Garamond uppercase">
          {title}
        </h1>
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="text-base lg:text-2xl leading-10 2xl:leading-[70px] text-khaki font-semibold font-Garamond flex items-center"
          >
            Home <span className="mx-2 text-white">/</span>
          </Link>
          <Link
            to="#"
            className="text-base lg:text-2xl leading-10 2xl:leading-[70px] text-white font-semibold font-Garamond capitalize"
          >
            {title}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
