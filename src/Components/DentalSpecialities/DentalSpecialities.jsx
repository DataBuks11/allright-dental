import React from 'react';
import { FaSmile, FaTeethOpen, FaRegGrinHearts, FaTeeth, FaTooth } from 'react-icons/fa';
import Button from '../Button/Button';
import CommonHeading from '../CommonHeading/CommonHeading';
import "./DentalSpecialties.css"

const DentalSpecialties = () => {
    const specialties = [
        {
            id: 1,
            title: "Dental Implants",
            description: "Dental implants are artificial tooth roots—usually made of titanium or zirconia—surgically placed into the jawbone.",
            icon: <FaSmile />,
            btnPath: '/dental-implants'
        },
        {
            id: 2,
            title: "Dental Veneers",
            description: "Dental veneers are ultra-thin, custom-made shells (typically porcelain or composite resin) that are bonded to the front surface of your teeth.",
            icon: <FaTooth />,
            btnPath: '/dental-veneers'
        },
        {
            id: 3,
            title: "Endodontic Treatments",
            description: "Endodontic treatment, commonly known as a root canal, is a dental procedure used to treat infections or inflammation within the pulp (the soft tissue inside the tooth).",
            icon: <FaTeethOpen />,
            btnPath: '/endodontic-treatments'
        },
        {
            id: 4,
            title: "Orthodontic Treatment",
            description: "Clear aligners are a modern orthodontic solution designed to straighten teeth discreetly and comfortably.",
            icon: <FaRegGrinHearts />,
            btnPath: '/orthodontic-treatments'
        },
        {
            id: 5,
            title: "Teeth Whitening",
            description: "Teeth whitening is a popular cosmetic dental procedure aimed at lightening the color of teeth and removing stains or discoloration.",
            icon: <FaTeeth />,
            btnPath: '/teeth-whitening'
        },
        {
            id: 6,
            title: "Periodontic Treatment",
            description: "Periodontic treatment focuses on the prevention, diagnosis, and management of diseases affecting the gums and supporting structures of the teeth.",
            icon: <FaTooth />,
            btnPath: '/periodontic-treatments'
        },
        {
            id: 7,
            title: "Dentures",
            description: "Dentures are removable prosthetic devices designed to replace missing teeth and surrounding tissues. They help restore function (chewing, speaking) and aesthetics.",
            icon: <FaTooth />,
            btnPath: '/dentures'
        },
        {
            id: 8,
            title: "Emergency Service",
            description: "Immediate care for severe toothaches, broken or knocked-out teeth, infections, and other urgent dental conditions.",
            icon: <FaTooth />,
            btnPath: '/emergency-service'
        }

    ];

    return (
        <div className="py-10 sm:py-16 w-full px-4 sm:px-6 lg:px-0 font-poppins bg-white">
            <div className="container mx-auto max-w-[1140px]">
                <CommonHeading
                    mainContent="Our Dental Specialities"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mt-8 sm:mt-16">
                    {specialties.map((specialty) => (
                        <div
                            key={specialty.id}
                            className="relative flex flex-col border-2 border-[#00B7AA] bg-white rounded-xl p-5 sm:p-8 transition-all duration-500 hover:duration-300 group"
                        >
                            {/* Background accent on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#003BC4] to-[#00B7AA] opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>

                            {/* Icon with gradient border */}
                            <div className="mb-6 w-20 h-20 rounded-full flex items-center justify-center  relative">
                                <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-br from-[#003BC4] to-[#00B7AA]  group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        {React.cloneElement(specialty.icon, {
                                            className: "text-3xl text-[#00B7AA]"
                                        })}
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold  text-[#003BC4] mb-3 group-hover:text-[#00B7AA] transition-colors duration-300">
                                {specialty.title}
                            </h3>
                            <p className="text-gray-600 mb-6 flex-grow">{specialty.description}</p>

                            <div className="mt-auto pt-4">
    <Button
        btnContent="Learn More"
        link={specialty.btnPath}
        className="bg-[#003BC4] hover:bg-[#00B7AA] text-white px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 w-fit"
    />
</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DentalSpecialties;