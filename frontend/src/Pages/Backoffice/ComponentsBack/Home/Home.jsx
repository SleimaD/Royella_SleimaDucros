import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacilitiesBack from './FacilitiesBack';
import ActionBack from './ActionBack';
import HeroSectionBack from './HeroSectionBack';
import HotelBack from './HotelBack';

function Home() {


  return (
    <div className='w-full h-screen flex flex-col gap-7 px-4 p-1'>
      <h1 className=' text-4xl font-bold text-center'>Home</h1>
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
        <HotelBack />
      </section>
    </div>
  )
}

export default Home