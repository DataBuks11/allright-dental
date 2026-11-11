import React from "react";
import { FaTooth, FaHeartbeat, FaUsers, FaShieldAlt, FaHandHoldingHeart } from "react-icons/fa";
import { GiHealthNormal } from "react-icons/gi";
import CommonHeading from "../CommonHeading/CommonHeading";

const MissionAndValues = () => {
    const practiceInfo = {
        mission: {
            statement: "To provide exceptional dental care in a comfortable environment, helping our patients achieve and maintain optimal oral health for life.",
            details: [
                "Comprehensive dental services for all ages",
                "State-of-the-art technology for precise diagnostics",
                "Pain-minimizing techniques for anxiety-free visits",
                "Personalized treatment plans for each patient"
            ]
        },
    };

    return (
        <div className="relative bg-blue-50 py-16 px-6 w-full lg:px-0 font-poppins">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#003BC4]/10 to-transparent -z-10"></div>

            <div className="container mx-auto max-w-[1140px]">
                {/* Mission Header */}
                <div className="text-center mb-16">
                    <CommonHeading mainContent="Our Mission" />
                </div>

                {/* Mission Statement */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
                    <div className="w-full">
                        <div className="relative rounded-xl overflow-hidden  w-full shadow-lg">
                            <img
                                src="/ourMissionUpdate.jpg"
                                alt="Modern dental practice"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <h2 className="text-3xl font-bold text-[#003BC4] mb-6">
                            Our Commitment to You
                        </h2>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            {practiceInfo.mission.statement}
                        </p>
                        <ul className="space-y-3">
                            {practiceInfo.mission.details.map((detail, index) => (
                                <li key={index} className="flex items-start">
                                    <div className="bg-[#00B7AA] rounded-full p-1 mr-3 mt-1">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-gray-700">{detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionAndValues;