import React, { useRef, useState } from 'react';
import { FaPlay, FaPause, FaCheckCircle, FaCalendarAlt, FaTooth, FaShieldAlt } from 'react-icons/fa';
import CommonHeading from '../CommonHeading/CommonHeading';
import Button from '../Button/Button';

const PromotionalVideo = () => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/50 to-white font-poppins relative overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#00B7AA]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#003BC4]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-[1140px] mx-auto container relative z-10">
                <CommonHeading 
                    subHeading="Discover Allright Dental" 
                    mainContent="Experience Gentle, Modern & Trusted Dental Care" 
                />
                
                <p className="text-center text-gray-600 max-w-2xl mx-auto -mt-6 mb-12 text-base sm:text-lg">
                    Take a virtual tour of our practice and see how Dr. Shalini Mandapatti and our dedicated team bring healthy, radiant smiles to life every day.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Video Player Column */}
                    <div className="lg:col-span-7">
                        <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black">
                            <video
                                ref={videoRef}
                                src="/promotional_video.mp4"
                                controls
                                playsInline
                                preload="metadata"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                className="w-full h-auto aspect-video object-cover"
                            />
                            
                            {/* Play overlay overlay when paused */}
                            {!isPlaying && (
                                <button
                                    onClick={togglePlay}
                                    aria-label="Play promotional video"
                                    className="absolute inset-0 w-full h-full bg-black/30 flex items-center justify-center transition-all group-hover:bg-black/20 cursor-pointer"
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
                                        <FaPlay className="text-2xl sm:text-3xl ml-1" />
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Features Column */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
                            <div className="p-3 bg-[#003BC4]/10 text-[#003BC4] rounded-xl text-xl flex-shrink-0">
                                <FaTooth />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">Comprehensive Dental Services</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    From routine exams and teeth cleanings to advanced dental implants, root canals, and cosmetic veneers.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
                            <div className="p-3 bg-[#00B7AA]/10 text-[#00B7AA] rounded-xl text-xl flex-shrink-0">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">State-of-the-Art Technology</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Digital low-dose X-rays and gentle care protocols ensure your comfort and peace of mind at every step.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
                            <div className="p-3 bg-[#003BC4]/10 text-[#003BC4] rounded-xl text-xl flex-shrink-0">
                                <FaCalendarAlt />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">Seamless Online Booking</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Select your preferred room, date, and time slot directly online with instant email verification.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row gap-4">
                            <Button btnContent="Book an Appointment" link="/Appointment" />
                            <a 
                                href="tel:2152951348" 
                                className="px-6 py-3 rounded-lg border-2 border-[#003BC4] text-[#003BC4] font-semibold text-center hover:bg-[#003BC4] hover:text-white transition-colors"
                            >
                                Call (215) 295-1348
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PromotionalVideo;
