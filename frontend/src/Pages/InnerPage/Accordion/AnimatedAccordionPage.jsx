import Accordion from "./Accordion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AnimatedAccordionPage() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/faqs/')
      .then(response => {
        setFaqs(response.data);
      })
      .catch(error => console.log('Error fetching FAQs:', error));
  }, []);

  return (
    <main className="relative flex flex-col justify-center  overflow-hidden">
      <div className="w-full mx-auto px-4 md:px-6 ">
        <div
          className=" grid items-end grid-cols-1 lg:grid-cols-2  gap-x-[30px]"
          data-aos="zoom-in-up"
          data-aos-duration="1000"
        >
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              title={faq.question}
              id={`faqs-${index}`}
              active={false}
            >
              {faq.answer}
            </Accordion>
          ))}
          </div>
      </div>
    </main>
  );
}
