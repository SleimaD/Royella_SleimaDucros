import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Accordion from '../../../InnerPage/Accordion/Accordion';
import { ImBin } from "react-icons/im";

function PricingBack() {
  const [faqs, setFaqs] = useState([]);
  const [editFaqId, setEditFaqId] = useState(null);
  const [faqData, setFaqData] = useState({ question: '', answer: '' });
  const [isAdding, setIsAdding] = useState(false); 

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = () => {
    axios.get('http://localhost:8000/api/faqs/')
      .then(response => setFaqs(response.data))
      .catch(error => console.error('Error fetching FAQs:', error));
  };

  const handleFaqChange = (e) => {
    setFaqData({ ...faqData, [e.target.name]: e.target.value });
  };

  const saveFaq = () => {
    const method = editFaqId ? 'put' : 'post';
    const url = editFaqId ? `http://localhost:8000/api/faqs/${editFaqId}/` : 'http://localhost:8000/api/faqs/';

    axios[method](url, faqData)
      .then(() => {
        fetchFAQs();
        setEditFaqId(null);
        setFaqData({ question: '', answer: '' });
        setIsAdding(false);
      })
      .catch(error => console.error('Error saving FAQ:', error));
  };

  const startEdit = (faq) => {
    setEditFaqId(faq.id);
    setFaqData({ question: faq.question, answer: faq.answer });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditFaqId(null);
    setFaqData({ question: '', answer: '' });
    setIsAdding(false);
  };

  const toggleAddFaq = () => {
    setIsAdding(!isAdding);
    setEditFaqId(null);
    setFaqData({ question: '', answer: '' });
  };

  const deleteFaq = (id) => {
    axios.delete(`http://localhost:8000/api/faqs/${id}/`)
      .then(() => fetchFAQs())
      .catch(error => console.error('Error deleting FAQ:', error));
  };

  return (
    <div className='w-full mt-5 px-4'>
      <h1 className="text-6xl text-center font-bold mb-14 font-Garamond">PRICING </h1>
      <div className='w-[70%] mx-auto  p-3 px-10 overflow-y-auto h-[40rem]'>
        <button
          onClick={toggleAddFaq}
          className={`mb-3 ${isAdding ? ' bg-red-500' : 'btn-primary'} text-white p-2 `}
        >
          {isAdding ? 'Cancel' : 'Add New Q&A'}
        </button>
        {isAdding && (
          <div className='flex gap-5 p-2'>
            <input
              type="text"
              name="question"
              value={faqData.question}
              onChange={handleFaqChange}
              placeholder="New FAQ Question"
              className="text-black rounded-lg "
            />
            <textarea
              name="answer"
              value={faqData.answer}
              onChange={handleFaqChange}
              placeholder="New FAQ Answer"
              className="text-black rounded-lg "
            />
            <button className='btn-primary' onClick={saveFaq}>Add FAQ</button>
          </div>
        )}
        {faqs.map((faq) => (
          <Accordion key={faq.id} title={faq.question} id={`faq-${faq.id}`} active={editFaqId === faq.id}>
            {editFaqId === faq.id ? (
              <div className='flex gap-5 p-2 flex-wrap'>
                <input
                  type="text"
                  name="question"
                  value={faqData.question}
                  onChange={handleFaqChange}
                  className="text-black overflow-y-auto w-[50%]  "
                />
                <textarea
                  name="answer"
                  value={faqData.answer}
                  onChange={handleFaqChange}
                  className="text-black px-4 w-[50%]"
                />
                <div className='p-1 flex items-center justify-center gap-3'>
                  <button className='text-green-400 text-2xl' onClick={saveFaq}>Save</button>
                  <button className='text-red-500 text-2xl' onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <p>{faq.answer}</p>
            )}
            <div className='p-2 flex items-center justify-between'>
            <button onClick={() => startEdit(faq)} className='bg-khaki text-white p-1 px-5 rounded'>Edit</button>
            <button onClick={() => deleteFaq(faq.id)} className='text-[#f74d4d] text-2xl'><ImBin /></button>
            </div>
          </Accordion>
        ))}

      </div>
    </div>
  );
}

export default PricingBack;
