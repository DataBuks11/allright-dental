import React from 'react';
import CommonHeading from '../CommonHeading/CommonHeading';
import Button from '../Button/Button';

function DentalPractice() {
    const handlePDFDownload = () => {
        const pdfURL = "/patientForm.pdf"
        const link = document.createElement('a');
        link.href = pdfURL;
        link.download = "patientForm.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    return (
        <div className="bg-white flex flex-col items-center justify-center overflow-hidden font-poppins py-10 sm:py-16 px-4 sm:px-6 lg:px-0">
            <div className="max-w-[1140px] container mx-auto">
                {/* Header Section */}
                <CommonHeading mainContent="Delivering Gentle & Expert Dental Care" />

                {/* Content Section */}
                <div className="py-4 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Appointment Card */}
                    <div className="bg-white border-2 border-[#00B7AA] rounded-xl p-5 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                        <div className="bg-gradient-to-br from-[#003BC4] to-[#00B7AA] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#003BC4] mb-4">Request appointment</h3>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">Schedule your visit with our expert dental team for personalized care.</p>
                        <div className="mt-auto">
                            <Button btnContent="Book Now" link="/Appointment" className="w-full"/>
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white border-2 border-[#00B7AA] rounded-xl p-5 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                        <div className="bg-gradient-to-br from-[#003BC4] to-[#00B7AA] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#003BC4] mb-4">Contact us today!</h3>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">Our friendly staff is ready to answer all your questions and concerns.</p>
                        <div className="mt-auto">
                            <Button btnContent="Contact Us" link="/contactus" className="w-full"/>
                        </div>
                    </div>

                    {/* Forms Card */}
                    <div className="bg-white border-2 border-[#00B7AA] rounded-xl p-5 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                        <div className="bg-gradient-to-br from-[#003BC4] to-[#00B7AA] w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#003BC4] mb-4">Patient intake forms</h3>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">Complete your digital paperwork online in 2 minutes before your visit, or download PDF.</p>
                        <div className="mt-auto flex flex-col gap-2.5">
                            <Button btnContent="Fill Out Online" link="/patient-form" className="w-full" />
                            <button
                                type="button"
                                onClick={handlePDFDownload}
                                className="w-full text-xs font-semibold text-gray-500 hover:text-[#003BC4] py-1 transition text-center cursor-pointer underline"
                            >
                                Download blank PDF form
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DentalPractice;