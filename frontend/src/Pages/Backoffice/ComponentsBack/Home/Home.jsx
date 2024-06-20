import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacilitiesBack from './FacilitiesBack';
import ActionBack from './ActionBack';
import HeroSectionBack from './HeroSectionBack';
import HotelBack from './HotelBack';
import ServicesBack from './ServicesBack';
import TestimonialBack from './TestimonialBack';

function Home() {


  return (
    <div className='w-full h-screen flex flex-col gap-3 px-4 p-1'>
      <h1 className="text-6xl text-center font-bold  mt-5 font-Garamond ">HOME</h1>
      <section className=''>
        <HotelBack />
      </section>
      <section className=" w-full">
        <ServicesBack />
      </section>
      <section className='mt-4'>
        <FacilitiesBack />
      </section>
      <section className='mt-4'>
        <ActionBack />
      </section>
      <section className='mt-4'>
        <HeroSectionBack />
      </section>
      <section className='mt-4'>
        <TestimonialBack />
      </section>
    </div>
  )
}

export default Home