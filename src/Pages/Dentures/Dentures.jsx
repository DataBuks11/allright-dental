import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import Button from '../../Components/Button/Button';

function Dentures() {
    return (
        <div className='w-full bg-blue-50 relative px-6 lg:px-0 py-16 pt-[80px] font-poppins'>
            <div className="max-w-[1140px] mx-auto container">
                {/* Hero Section */}
                <div className="text-center mb-16 relative">
                    <CommonHeading mainContent="Dentures" className="mt-10" />
                </div>

                {/* What Are Dentures */}
                <div className="relative mb-16 overflow-hidden rounded-2xl border border-[#00B7AA] bg-white">
                    <div className="p-8 md:p-10">
                        <div className="flex items-center mb-6">
                            <h2 className="text-2xl font-semibold text-[#003BC4]">
                                Dentures - <span className='text-[#00B7AA]'>Your Complete Smile Solution</span>
                            </h2>
                        </div>
                        <p className="text-gray-600 mb-6">
                        Dentures are removable prosthetic devices designed to replace missing teeth and surrounding tissues. They help restore function (chewing, speaking) and aesthetics.
                        </p>
                        <div className='relative rounded-xl overflow-hidden'>
                            <img src="/dentures.jpg" alt="Dentures before and after" loading='lazy' className='w-full h-auto object-cover' />
                        </div>
                    </div>
                </div>

                {/* Types of Dentures */}
                <div className="mb-16">
                    <h2 className="text-2xl font-semibold text-center mb-12">
                        <span className="text-[#003BC4] relative">
                            Types of Dentures
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { 
                                title: "Complete Dentures", 
                                desc: "Used when all teeth are missing.",
                                icon: "🦷"
                            },
                            { 
                                title: "Partial Dentures", 
                                desc: "Used when some natural teeth remain.",
                                icon: "🔘"
                            },
                            { 
                                title: "Immediate Dentures", 
                                desc: "Placed right after tooth extraction.",
                                icon: "⚡"
                            },
                            { 
                                title: "Implant-Supported Dentures", 
                                desc: "Anchored to dental implants for better stability.",
                                icon: "📌"
                            }
                        ].map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#00B7AA]/30"
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4]/10 to-[#00B7AA]/10 flex items-center justify-center text-[#003BC4] text-xl mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-[#003BC4]">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features & Benefits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Key Features */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-semibold text-[#003BC4] mb-6 flex items-center">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] mr-3"></div>
                            Key Features
                        </h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-[#003BC4] mr-2">•</span>
                                <span>Made from acrylic, metal, or flexible materials.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#003BC4] mr-2">•</span>
                                <span>Custom-fitted for comfort and function.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#003BC4] mr-2">•</span>
                                <span>Require daily cleaning and proper care.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#003BC4] mr-2">•</span>
                                <span>Periodic adjustments may be needed for fit.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Benefits */}
                    <div className="bg-gradient-to-br from-[#003BC4]/5 to-[#00B7AA]/5 p-8 rounded-2xl border border-gray-100">
                        <h2 className="text-2xl font-semibold text-[#003BC4] mb-6 flex items-center">
                            <div className="w-4 h-4 rounded-full bg-[#00B7AA] mr-3"></div>
                            Benefits of Dentures
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Restores aesthetics and confidence",
                                "Improves speech and chewing ability",
                                "Prevents facial sagging due to tooth loss"
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-start bg-white/80 p-3 rounded-lg">
                                    <span className="text-[#00B7AA] mr-2">✓</span>
                                    <span className="text-gray-700">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Care Tips */}
                <div className="relative mb-16 py-8 px-6 md:p-10 rounded-3xl bg-white shadow-md overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00B7AA]/5 rounded-full blur-xl"></div>
                    <h2 className="text-2xl font-semibold text-[#003BC4] mb-8 relative z-10">
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#00B7AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Denture Care Tips
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {[
                            { icon: "🧼", tip: "Clean daily with a denture brush" },
                            { icon: "💧", tip: "Soak overnight in denture cleanser" },
                            { icon: "🚫", tip: "Avoid dropping or bending the denture" }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 bg-blue-50/50 p-4 rounded-lg">
                                <div className="text-2xl">{item.icon}</div>
                                <p className="text-gray-700">{item.tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="relative rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                    <div className="relative z-10 p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Rediscover Your Smile</h2>
                        <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
                            Modern dentures offer a comfortable, natural-looking solution for missing teeth. 
                            Whether you need full or partial dentures, we can help restore your smile and confidence.
                        </p>
                        <Button btnContent="Schedule a Consultation" link="/contactus"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dentures;