import React from 'react'
import HeroSlider from '../Components/HeroSlider/HeroSlider'
import AboutUs from './AboutUs/AboutUs'
import DentalSpecialities from '../Components/DentalSpecialities/DentalSpecialities'
import WhyChooseUs from '../Components/WhyChooseUs/WhyChooseUs'
import DoctorProfile from '../Components/DoctorProfile/DoctorProfile'
import DentalPractice from '../Components/DentalPractice/DentalPractice'
import MissionAndValues from '../Components/MissionAndAwards/MissionAndAwards'
import AboutPractice from '../Components/AboutPractice/AboutPractice'
import PromotionalVideo from '../Components/PromotionalVideo/PromotionalVideo'
import FAQSection from '../Components/FAQSection/FAQSection'

function Home() {
  return (
    <>
        <HeroSlider />  
        <DentalPractice />
        <MissionAndValues />
        <PromotionalVideo />
        <DentalSpecialities />
        <DoctorProfile />
        <FAQSection />
        <WhyChooseUs />
    </>
  )
}

export default Home