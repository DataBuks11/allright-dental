import React from "react";
import { FaTooth, FaSmile, FaUserMd, FaClinicMedical, FaHeartbeat, FaCamera } from "react-icons/fa";
import { GiTooth, GiHealthNormal } from "react-icons/gi";
import CommonHeading from "../CommonHeading/CommonHeading";
import Button from "../Button/Button";

const AboutPractice = () => {
    const benefits = [
        { icon: <FaUserMd className="text-3xl" />, title: "Expert Dentists", desc: "Board-certified professionals with years of experience" },
        { icon: <FaClinicMedical className="text-3xl" />, title: "Modern Equipment", desc: "State-of-the-art technology for precise treatment" },
        { icon: <FaSmile className="text-3xl" />, title: "Painless Procedures", desc: "Gentle techniques for maximum comfort" },
        { icon: <GiHealthNormal className="text-3xl" />, title: "Preventive Care", desc: "Focus on long-term oral health strategies" },
        { icon: <FaCamera className="text-3xl" />, title: "Digital Imaging", desc: "Advanced diagnostics for accurate results" },
        { icon: <FaHeartbeat className="text-3xl" />, title: "Health Focused", desc: "Whole-body approach to dental care" }
    ];

    return (
        <div className="relative bg-white px-6 lg:px-0 py-16 overflow-hidden font-poppins">
            {/* Decorative elements */}


            <div className="container mx-auto max-w-[1140px] relative z-10">
                {/* Welcome Section */}
                <CommonHeading mainContent="Welcome to Allright Dental" />
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        "Welcome! The dental professionals at Allright Dental are pleased to welcome you to our practice. We want all our patients to be informed decision makers and fully understand any health issues you face."
                    </p>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-20 overflow-hidden">
                    {benefits.map((item, index) => (
                        <div key={index} className="relative h-full group border-2 overflow-hidden border-[#003BC4]  group-hover:border-transparent transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#00B7AA] to-[#003BC4]  scale-0 group-hover:scale-100 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"></div>
                            <div className="relative z-10 p-8 h-full flex flex-col transition-all duration-300 group-hover:text-white">
                                <div className="w-14 h-14 bg-white group-hover:bg-transparent border-2 group-hover:border-white rounded-full flex items-center justify-center text-[#003BC4] group-hover:text-white mb-6 transition-all duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 ">{item.title}</h3>
                                <p className="group-hover:opacity-100 transition-opacity duration-700">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats and Services Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <h2 className="text-4xl font-bold text-[#003BC4] mb-6 leading-tight">
                            A Few of the <span className="text-[#00B7AA]">Unique Benefits</span> You'll Enjoy
                        </h2>
                        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                            Please take a moment to explore our website to learn more about Allright Dental's capabilities and services. We invite you to call our office to request an appointment or ask any questions.
                        </p>
                        <Button btnContent="Request Appointment" link="/contactus" />

                    </div>
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="/yourDentist.jpg"
                                alt="Dentist at Allright Dental"
                                className="w-full h-auto object-cover transition-all duration-500 hover:scale-105 transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#003BC4]/30 to-transparent"></div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <div className="flex items-center">
                                <div className="bg-[#00B7AA] p-3 rounded-lg mr-4">
                                    <FaSmile className="text-white text-2xl" />
                                </div>
                                <div>
                                    <p className="text-gray-600">Satisfaction Rate</p>
                                    <p className="text-2xl font-bold text-[#003BC4]">98%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default AboutPractice;