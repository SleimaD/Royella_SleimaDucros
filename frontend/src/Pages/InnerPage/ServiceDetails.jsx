import { BsCheck2 } from "react-icons/bs";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/services/${id}/`
        );
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchService();
  }, [id]);

  if (!service) {
    return <div>Loading...</div>;
  }

  const hoursDetails = service.details.filter(
    (detail) => detail.title.toLowerCase() === "hours"
  );

  return (
    <section className="">
      <BreadCrumb title="Service Details" />

      {/* Service Details content */}
      <div className="py-20 2xl:py-[120px] dark:bg-lightBlack">
        <div className="Container">
          {/* image and Food list */}
          <div className="grid items-center grid-cols-6 md:grid-cols-7 lg:grid-cols-6 gap-5 ">
            <div
              className="col-span-6 md:col-span-4"
              data-aos="zoom-in-up"
              data-aos-duration="1000"
            >
              <img src={service.image} alt={service.title} />
            </div>
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <div className=" bg-whiteSmoke dark:bg-normalBlack px-7 py-8 md:px-5 md:py-10 lg:px-6 lg:py-11 2xl:px-10 2xl:py-[50px]  grid-flow-row-dense">
                <h4 className="font-Garamond text-xl sm:text-[22px] md:text-2xl xl:text-3xl leading-7 md:leading-8 lg:leading-10 xl:leading-[50px] 2xl:leading-[60px] 3xl:leading-[70px] text-lightBlack dark:text-white font-semibold mb-7">
                  Hours
                </h4>
                <div
                  className="grid items-center gap-[25px] "
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                >
                  {hoursDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-lightBlack h-10 lg:h-[50px] 2xl:h-[56px] grid items-center justify-start px-3 sm:px-5 2xl:px-6 "
                    >
                      <p className="text-sm md:text-[13px] xl:text-[15px] leading-[26px] font-Lora font-medium text-lightBlack dark:text-white">
                        <span className="text-khaki">
                          {" "}
                          {detail.description}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurants center */}
          <div className="pt-5 lg:pt-[35px]  pr-3">
            <p className="text-base font-Lora text-khaki">FOODS</p>
            <h2 className="py-2 sm:py-3 md:py-4 lg:py-[19px] 2xl:py-[25px] font-Garamond text-[22px] sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-[38px] 3xl:text-[40px] leading-6 lg:leading-[26px]  text-lightBlack dark:text-white font-semibold">
              {service.title}
            </h2>
            <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora">
              {service.description}
            </p>

            {/* Additional Details */}
            {service.details.map((detail, index) => (
              <div
                key={index}
                className="py-10 lg:py-[60px]"
                data-aos="zoom-in-up"
                data-aos-duration="1000"
              >
                <h2 className="pb-2 sm:pb-3 md:pb-4 lg:pb-[19px] 2xl:pb-6 font-Garamond text-[22px] sm:text-2xl md:text-3xl 2xl:text-[32px] leading-7 lg:leading-[26px] text-lightBlack dark:text-white font-semibold">
                  {detail.title}
                </h2>
                <p className="text-sm lg:text-base leading-6 text-gray dark:text-lightGray font-normal font-Lora">
                  {detail.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
