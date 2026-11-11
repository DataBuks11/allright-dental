import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import Button from '../../Components/Button/Button';

function EndodonticTreatments() {
    return (
        <>
            <div className='w-full bg-blue-50 relative px-6 lg:px-0 py-16 pt-[80px] font-poppins'>
                <div className="max-w-[1140px] mx-auto container">
                    {/* Hero Section */}
                    <div className="text-center mb-16 relative">
                        <CommonHeading mainContent="Endodontic Treatments" className="mt-10" />
                    </div>

                    {/* What Is Endodontic Treatment */}
                    <div className="relative mb-16 overflow-hidden rounded-2xl">
                        <div className="relative bg-white rounded-[15px] p-8">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-semibold text-[#003BC4]">
                                    Endodontic Treatment- <span className='text-[#00B7AA]'>Saving the Natural Tooth</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 mb-6">
                            <b>Endodontic treatment</b>, commonly known as a <b>root canal</b>, is a dental procedure used to treat
                             infections or inflammation within the pulp (the soft tissue inside the tooth). 
                             This therapy helps preserve the natural tooth, avoiding extraction while relieving
                              pain and restoring function.
                            </p>
                            <div className='relative'>
                                <img src="/endodonticTreatments.jpg" alt="" loading='lazy' className='w-full object-cover' />
                            </div>
                        </div>
                    </div>

                    {/* When Is Treatment Needed */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4] relative">
                                When Is Endodontic Treatment Needed?
                            </span>
                    
                        </h2>
                       
                        <div className="sm:px-6 lg:px-8">
                            <div className="relative">

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        {[
                                            { text: "You have a deep cavity or decay", icon: "🦷" },
                                            { text: "A tooth is cracked or chipped", icon: "🦷" },
                                            { text: "There’s trauma to the tooth", icon: "⚡" }
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-md transition-all duration-300 relative overflow-hidden group"
                                            >
                                                <div className="absolute -right-4 top-0 w-16 h-full bg-[#00B7AA]   transition-opacity"></div>
                                                <div className="flex items-center space-x-4 relative z-10">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-600 text-lg">
                                                        {item.icon}
                                                    </div>
                                                    <p className="text-gray-700 font-medium">{item.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Column (offset) */}
                                    <div className="space-y-6">
                                        {[
                                            { text: "You experience severe, persistent tooth pain", icon: "🩺" },
                                            { text: "There is sensitivity to hot/cold that lingers", icon: "🌡️" },
                                            { text: "Swelling or tenderness occurs around the gums", icon: "⚠️" }
                                        ].map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-md transition-all duration-300 relative overflow-hidden group"
                                            >
                                                <div className="absolute -right-4 top-0 w-16 h-full bg-[#00B7AA]  transition-opacity"></div>
                                                <div className="flex items-center space-x-4 relative z-10">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg text-blue-600 text-lg">
                                                        {item.icon}
                                                    </div>
                                                    <p className="text-gray-700 font-medium">{item.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Procedure Overview */}
                    <div className="relative mb-16 py-12 px-6 rounded-3xl  overflow-hidden">
                        <h2 className="text-2xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4]">
                                Procedure Overview
                            </span>
                        </h2>
                        <div className="relative">
                            <div className="hidden md:block absolute top-[25px] left-0 right-0 h-1 bg-gradient-to-r from-[#003BC4]/30 via-[#00B7AA]/50 to-[#003BC4]/30 z-0"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 relative z-10">
                                {[
                                    { step: "1", title: "Diagnosis", desc: "X-rays are taken to examine the tooth’s pulp and surrounding bone." },
                                    { step: "2", title: "Pulp Removal", desc: "The dentist or endodontist removes the inflamed or infected pulp from the root canals." },
                                    { step: "3", title: "Cleaning", desc: "The canals are cleaned, disinfected, and shaped to prepare for filling." },
                                    { step: "4", title: "Filling", desc: "The empty canals are filled with a biocompatible material (usually gutta-percha)." },
                                    { step: "5", title: "Restoration", desc: "A crown or filling is placed to protect and restore the tooth's full function." }
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center text-center relative">
                                        {/* Circle */}
                                        <div className="w-12 h-12 relative rounded-full bg-gradient-to-br from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                            {item.step}
                                        </div>
                                        {/* Card */}
                                        <div className="relative bg-white h-36 rounded-lg  shadow-md mt-8 w-full max-w-[200px] flex flex-col justify-center px-4 py-3">
                                            {/* Vertical line */}
                                            <div className="absolute h-14  w-1 bg-[#003BC4] -top-8 -z-10 left-1/2"></div>

                                            <h3 className="text-base font-semibold text-[#003BC4] mb-1">{item.title}</h3>
                                            <p className="text-gray-600 text-sm">{item.desc}</p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Benefits */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <h2 className="text-2xl font-semibold text-[#003BC4] mb-6">
                                <div className="flex items-center">
                                    Benefits
                                </div>
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00B7AA] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Relieves pain and infection</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00B7AA] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Preserves natural teeth and appearance</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00B7AA] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Restores chewing function</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#00B7AA] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Prevents further infection or bone loss</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Aftercare */}
                        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <h2 className="text-2xl font-semibold text-[#003BC4] mb-6">
                                <div className="flex items-center">
                                    Aftercare & Recovery
                                </div>
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#003BC4] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Mild soreness or discomfort is normal for a few days</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#003BC4] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Over-the-counter pain relievers usually suffice</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#003BC4] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">Good oral hygiene and regular check-ups are essential</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-[#003BC4] mt-2 mr-3"></div>
                                    <div>
                                        <p className="text-gray-600">A final crown is often recommended for strength and longevity</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                        <div className="relative z-10 p-12 text-center">
                            <h2 className="text-3xl font-bold text-white mb-6">In Summary</h2>
                            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
                                Endodontic treatment is a highly effective way to save infected or damaged teeth while relieving pain.
                                Modern techniques make the procedure comfortable with excellent long-term results when combined with proper aftercare.
                            </p>
                            <Button btnContent="Schedule Your Appointment" link="/Appointment"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EndodonticTreatments;