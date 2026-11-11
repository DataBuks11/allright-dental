import React from 'react'
import DentalSpecialties from '../../Components/DentalSpecialities/DentalSpecialities'
import CommonBanner from '../../Components/CommonBanner/CommonBanner'

function Services() {
  return (
    <>
        <main className='pt-[80px]'>
          <CommonBanner 
          backgroundImage="/specializationBanner.jpg"
          className="bg-top" 
          title="Our Specialties" 
          subtitle="We specialize in providing exceptional dental care"
          />
            <DentalSpecialties />
        </main>
    </>
  )
}

export default Services