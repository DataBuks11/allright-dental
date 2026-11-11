import React from 'react';
import { FaTooth, FaUserMd, FaSmile, FaPhoneAlt } from 'react-icons/fa';
import Button from '../../Components/Button/Button';
import CommonHeading from '../CommonHeading/CommonHeading';
import dentalImage from '../../assets/dentist_1.jpg';

const features = [
    { icon: <FaTooth />, text: 'Advanced Dental Technology' },
    { icon: <FaUserMd />, text: 'Experienced Dental Specialists' },
    { icon: <FaSmile />, text: 'Patient-Centered Care' },
    { icon: <FaPhoneAlt />, text: 'Emergency Dental Services' }
];

function WhyChooseUs() {
    return (
        <div className="bg-blue-50 text-black py-10 sm:py-12 px-4 sm:px-6 lg:px-0 w-full font-poppins relative overflow-hidden">
            <div className="absolute lg:block hidden -top-40 -right-40 w-80 h-80 rounded-full bg-[#00B7AA]"></div>

            <div className='container mx-auto max-w-[1140px]'>
                {/* Header Section */}
                <CommonHeading mainContent="Why Choose Us"/>


                {/* Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className='z-20 relative'>
                        <img
                               src={dentalImage}
                            alt="Dental Care"
                            className="h-[280px] sm:h-[450px] md:h-[650px] object-cover w-full shadow-lg rounded-xl"
                        />
                        <div className='absolute lg:block hidden -left-10 -bottom-10 -z-10 bg-[#003BC4] h-64 w-64'></div>
                    </div>

                    {/* Text Content */}
                    <div className='relative'>
                        <p className="leading-relaxed mb-6">
                            At <span className="font-bold text-[#003BC4]">Allright Dental</span>, our mission is to provide
                            exceptional dental services with a focus on patient comfort and long-term oral health.
                            Our experienced team of dental specialists ensures every visit is stress-free and effective.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            {features.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 flex flex-col gap-4 lg:h-44 items-center justify-center border border-[#00B7AA] rounded-lg hover:bg-[#00B7AA]/10 transition-colors duration-300"
                                >
                                    <div className='bg-[#00B7AA] p-4 rounded-full'>
                                    <p className="text-3xl text-white">{item.icon}</p>
                                    </div>
                                    <p className="font-medium text-center">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <Button
  btnContent={<span className="ml-0">Book an Appointment</span>}
  link="/Appointment"
  className="whitespace-nowrap"
/>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhyChooseUs;