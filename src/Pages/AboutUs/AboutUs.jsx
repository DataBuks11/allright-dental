import React from "react";
import AboutPractice from "../../Components/AboutPractice/AboutPractice";
import CommonBanner from "../../Components/CommonBanner/CommonBanner";
import DoctorProfile from "../../Components/DoctorProfile/DoctorProfile";


const AboutUs = () => {
    return (
        <>
            <main className="pt-[80px] font-poppins">
            <CommonBanner 
            backgroundImage="/aboutDoctorUpdate.png"
            className="bg-center"
            title="About Our Doctor"
            subtitle="Meet our experienced dental specialist" 
            />
            <DoctorProfile />
            <AboutPractice />
            </main>
        </>
    );
};

export default AboutUs;