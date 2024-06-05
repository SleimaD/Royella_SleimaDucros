import React from 'react'
import HotelAndFacilities from '../../componentsbackoffice/HotelAndFacilities/HotelAndFacilities';
import Action from '../../componentsbackoffice/CallDoAction/Action';


function Backoffice() {
  return (
    <div className='w-full'>
        <HotelAndFacilities />
        <Action />
    </div>
  )
}

export default Backoffice