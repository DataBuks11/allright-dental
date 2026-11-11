import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import Button from '../../Components/Button/Button';

function PeriodonticTreatment() {
    return (
        <>
            <div className='w-full bg-blue-50 relative px-6 lg:px-0 py-16 pt-[80px] font-poppins'>
                <div className="max-w-[1140px] mx-auto container">
                    {/* Hero Section */}
                    <div className="text-center mb-16 relative">
                        <CommonHeading mainContent="Periodontic Treatment" className="mt-10" />
                    </div>

                    {/* What Is Periodontic Treatment */}
                    <div className="relative mb-16 overflow-hidden rounded-2xl">
                        <div className="relative bg-white rounded-[15px] p-8">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-semibold text-[#003BC4]">
                                    Periodontic Treatment - <span className='text-[#00B7AA]'>Healthy Gums, Strong Teeth</span>
                                </h2>
                            </div>
                            <p className="text-gray-600 mb-6">
                            Periodontic treatment focuses on the prevention, diagnosis, and management of diseases affecting the gums and supporting structures of the teeth. The most common condition treated by periodontists is <b>periodontitis</b>, a serious gum infection that can lead to tooth loss if left untreated.
                            </p>
                            {/* <div className='relative'>
                                <img src="/periodonticTreatment.gif" alt="Periodontic Treatment" loading='lazy' className='w-full object-cover' />
                            </div> */}
                        </div>
                    </div>

                    {/* Key Treatments - Redesigned */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4] relative">
                                Key Periodontic Treatments
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { 
                                    title: "Scaling and Root Planing", 
                                    desc: "A deep cleaning procedure that removes plaque and tartar from below the gum line and smooths root surfaces to promote healing.",
                                    icon: "🧼"
                                },
                                { 
                                    title: "Gum Grafting", 
                                    desc: "Used to cover exposed roots or build up gum tissue lost to recession.",
                                    icon: "🩹"
                                },
                                { 
                                    title: "Flap Surgery", 
                                    desc: "Involves lifting the gums to clean deeper areas and repositioning them to reduce pocket depth.",
                                    icon: "✋"
                                },
                                { 
                                    title: "Dental Implants", 
                                    desc: "Periodontists specialize in placing implants where teeth have been lost.",
                                    icon: "🦷"
                                },
                                { 
                                    title: "Maintenance Therapy", 
                                    desc: "Regular cleanings and check-ups to prevent disease recurrence.",
                                    icon: "📅"
                                }
                            ].map((item, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4]/10 to-[#00B7AA]/10 flex items-center justify-center text-[#003BC4] text-xl mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-[#003BC4]">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Benefits & Aftercare Combined */}
                    <div className="mb-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-[#003BC4] mb-8">
                            <span className="flex items-center">
                                
                                Importance of Periodontic Care
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold text-[#00B7AA] mb-4">Why It's Essential</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="text-[#00B7AA] mr-2">•</span>
                                        <span>Maintains long-term oral health</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-[#00B7AA] mr-2">•</span>
                                        <span>Preserves natural teeth</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-[#00B7AA] mr-2">•</span>
                                        <span>Prevents progression of gum disease</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[#003BC4] mb-4">What to Expect</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <span className="text-[#003BC4] mr-2">•</span>
                                        <span>Personalized treatment plans</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-[#003BC4] mr-2">•</span>
                                        <span>Professional, comfortable care</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-[#003BC4] mr-2">•</span>
                                        <span>Ongoing maintenance recommendations</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                        <div className="relative z-10 p-12 text-center">
                            <h2 className="text-3xl font-bold text-white mb-6">In Summary</h2>
                            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
                                Periodontic care is essential for maintaining healthy gums and preserving natural teeth. Our specialized treatments address gum disease at every stage, from early intervention to advanced surgical procedures.
                            </p>
                            <Button btnContent="Schedule Your Consultation" link="/contactus"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PeriodonticTreatment;