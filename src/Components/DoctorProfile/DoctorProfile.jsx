import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaTooth, FaCalendarAlt, FaMapMarkerAlt, FaStar, FaAward } from 'react-icons/fa';
import Button from '../Button/Button';
import CommonHeading from '../CommonHeading/CommonHeading';

const DoctorProfile = () => {
    return (
        <div className="w-full relative bg-blue-50 overflow-hidden py-12 px-4 sm:px-6 lg:px-8 font-poppins">
            <div className="container mx-auto max-w-[1140px]">
                <CommonHeading mainContent="Meet Our Expert Dentist" />

                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Side - Doctor Image with Decorative Elements */}
                    <div className="lg:w-2/5 relative group">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="/drShaliniUpdate.jpg"
                                alt="Dr. Shalini Mandapatti"
                                className="w-full h-full object-cover min-h-[280px] sm:min-h-[400px]  transition-transform duration-500"
                            />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex items-center space-x-2">
                                    <FaMapMarkerAlt className="text-white text-xl" />
                                    <span className="text-white font-semibold text-lg">Allright Dental</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <FaCalendarAlt className="text-white text-xl" />
                                    <span className="text-white font-semibold text-lg">15+ Years Experience</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative badges */}
                        <div className="absolute -top-4 -right-4 bg-[#00B7AA] text-white p-3 rounded-full shadow-lg z-10">
                            <FaAward className="text-2xl" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-[#003BC4] text-white p-3 rounded-full shadow-lg z-10">
                            <FaStar className="text-2xl" />
                        </div>
                    </div>

                    {/* Right Side - Doctor Content */}
                    <div className="lg:w-3/5 bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 relative overflow-hidden">

                        <div className="relative z-10 flex flex-col h-full">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
                                    Dr. Shalini Mandapatti, <span className="text-[#003BC4]">DDS</span>
                                </h1>
                                <div className="flex items-center mt-3">
                                    <div className="bg-[#00B7AA]/20 p-2 rounded-lg mr-3">
                                        <FaTooth className="text-[#00B7AA] text-xl" />
                                    </div>
                                    <span className="text-lg text-gray-700 font-semibold">
                                        Specialist in Cosmetic Dentistry & Oral Care
                                    </span>
                                </div>

                                <div className="my-6 py-6 relative">
                                    <div className="absolute left-0 top-0 w-20 h-1 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] rounded-full"></div>
                                    <p className="text-gray-700 leading-relaxed text-lg">
                                        Dr. Shalini is a board-certified cosmetic dentist with over 15 years of experience.
                                        She specializes in smile makeovers, dental implants, and preventive care. Her gentle
                                        approach and attention to detail have earned her recognition as one of the top
                                        dentists in the region.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                                    <div className="bg-gradient-to-br from-[#003BC4]/5 to-[#00B7AA]/5 p-5 rounded-xl border border-[#003BC4]/10">
                                        <h3 className="font-bold text-[#003BC4] text-lg">Education</h3>
                                        <p className="text-gray-700 mt-2">New York University College Of Dentistry</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-[#00B7AA]/5 to-[#003BC4]/5 p-5 rounded-xl border border-[#00B7AA]/10">
                                        <h3 className="font-bold text-[#00B7AA] text-lg">Specializations</h3>
                                        <p className="text-gray-700 mt-2">Cosmetic, Restorative, Implantology</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="flex flex-wrap gap-4 mb-8">
                                    <a
                                        href="#"
                                        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#003BC4]/10 text-[#003BC4] hover:bg-[#003BC4]/20 transition-all duration-300 hover:scale-110"
                                        aria-label="Call"
                                    >
                                        <FaPhoneAlt className="text-xl" />
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#00B7AA]/10 text-[#00B7AA] hover:bg-[#00B7AA]/20 transition-all duration-300 hover:scale-110"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope className="text-xl" />
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#003BC4]/10 to-[#00B7AA]/10 text-[#003BC4] hover:from-[#003BC4]/20 hover:to-[#00B7AA]/20 transition-all duration-300 hover:scale-110"
                                        aria-label="LinkedIn"
                                    >
                                        <FaLinkedin className="text-xl" />
                                    </a>
                                </div>

                                <Button
                                    btnContent="Book An Appointment"
                                    link="/Appointment"
                                    className="w-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white py-4 text-lg font-semibold hover:from-[#003BC4]/90 hover:to-[#00B7AA]/90 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl whitespace-nowrap"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;