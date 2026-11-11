import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import { FaRegSmile, FaShieldAlt, FaClock, FaLeaf } from "react-icons/fa";
import Button from '../../Components/Button/Button';
function DentalVeneers() {
    const veneerBenefits = [
        {
            icon: <FaRegSmile className="text-2xl text-[#fff]" />,
            title: "Aesthetic Transformation",
            desc: "Instantly brighten your smile and create symmetry by covering flaws."
        },
        {
            icon: <FaShieldAlt className="text-2xl text-[#fff]" />,
            title: "Stain Resistance",
            desc: "Especially porcelain veneers, which resist discoloration over time."
        },
        {
            icon: <FaClock className="text-2xl text-[#fff]" />,
            title: "Durability",
            desc: "Porcelain veneers can last approximately 10–15 years, with composite veneers lasting 5–8 years."
        },
        {
            icon: <FaLeaf className="text-2xl text-[#fff]" />,
            title: "Minimally Invasive",
            desc: "Requires only a small enamel reduction and typically completes in 2–3 visits."
        },
    ];
    return (
        <>
            <div className='w-full px-6 lg:px-0 py-16 font-poppins bg-blue-50 pt-[80px]'>
                <div className="max-w-[1140px] mx-auto container">
                    {/* Hero Section */}
                    <div className="text-center mb-16 relative">
                        <CommonHeading mainContent="Dental Veneers" className="mt-10" />
                    </div>

                    {/* What Are Dental Veneers */}
                    <div className="relative mb-16 overflow-hidden rounded-2xl bg-white">

                        <div className="relative bg-white rounded-[15px] p-8">
                            <h2 className="text-2xl font-semibold  text-[#003BC4] mb-6">
                                What Are Dental Veneers?
                            </h2>
                            <p className="text-gray-600 mb-6">
                            Dental veneers are ultra-thin, custom-made shells (typically porcelain or composite resin)
                             that are bonded to the <b>front surface</b> of your teeth. They’re designed to enhance the appearance 
                             of your smile by changing tooth <b>color, shape, size,</b> or <b>length</b> — and conceal imperfections like 
                             chips, stains, or gaps 
                            </p>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 items-center gap-6 p-8'>
                            <img src="/dentalveneersOne.jpg" alt="" loading='lazy' />
                            <img src="/dentalveneersTwo.jpg" alt="" loading='lazy' />
                        </div>
                    </div>

                    {/* Benefits */}
                    <section className="mb-16">
                        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4] relative">
                                Benefits of Veneers
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {veneerBenefits.map((benefit, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA]">
                                            <span className="text-white text-xl">{benefit.icon}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#003BC4] group-hover:text-[#00B7AA] transition leading-snug">
                                            {benefit.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 text-md leading-relaxed">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <div className='grid grid-cols-1 lg:grid-cols-2 items-center pb-16 gap-6'>
                        <img src="/dentalveneersThree.jpg" alt="" loading='lazy' />
                        <img src="/dentalveneersFour.jpg" alt="" loading='lazy' />
                    </div>

                    {/* Types of Veneers */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-center mb-12 text-[#003BC4]">
                            Types of Veneers
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Porcelain",
                                    desc: "Highly durable, natural-looking, stain-resistant; requires enamel removal and lab custom fabrication.",
                                    pros: ["10-15 year lifespan", "Stain resistant", "Natural appearance"]
                                },
                                {
                                    title: "Composite Resin",
                                    desc: "Applied directly in one visit, less expensive, easier to repair—but more prone to staining and wear.",
                                    pros: ["Single visit", "More affordable", "Easy repairs"]
                                },
                                {
                                    title: "No Prep (Lumineers)",
                                    desc: "Ultra-thin porcelain that needs little to no enamel removal. Offers a subtle quiet glow-up but isn't suitable for everyone.",
                                    pros: ["Minimal enamel loss", "Reversible", "Subtle enhancement"]
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white p-6 rounded-xl border border-gray-200 hover:border-[#00B7AA] transition-colors duration-200 group overflow-hidden"
                                >
                                    {/* Subtle hover effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-[#00B7AA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Content */}
                                    <h3 className="relative text-xl font-semibold text-[#003BC4] mb-3 group-hover:text-[#00B7AA] transition-colors duration-200">
                                        {item.title}
                                    </h3>
                                    <p className="relative text-gray-600 mb-4">{item.desc}</p>
                                    <ul className="relative space-y-2">
                                        {item.pros.map((pro, i) => (
                                            <li key={i} className="flex items-start">
                                                <svg className="w-4 h-4 mt-1 mr-2 text-[#00B7AA] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-600">{pro}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Bottom border animation */}
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00B7AA] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Procedure Overview */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4] relative">
                                Procedure Overview
                            </span>
                        </h2>
                        <div className="relative">
                            <div className="absolute left-8 h-full w-0.5 bg-gradient-to-b from-[#003BC4] to-[#00B7AA] hidden md:block"></div>
                            {[
                                {
                                    step: "1",
                                    title: "Consultation & Prep",
                                    desc: "Initial exam, enamel removal, and impressions are taken if using porcelain"
                                },
                                {
                                    step: "2",
                                    title: "Lab Fabrication",
                                    desc: "Porcelain veneers are created in a lab (may require temporary veneers in the meantime). Composite ones are crafted directly during the visit"
                                },
                                {
                                    step: "3",
                                    title: "Bonding",
                                    desc: "Veneers are cemented to your teeth, color-matched, adjusted, and the bond is finalized"
                                }
                            ].map((item, index) => (
                                <div key={index} className="relative mb-10 md:flex items-start">
                                    <div className="hidden md:flex absolute left-0 w-16 h-16 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white font-bold text-2xl items-center justify-center mr-8">
                                        {item.step}
                                    </div>
                                    <div className="md:ml-24 bg-white w-full p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                        <div className="md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white font-bold text-xl flex items-center justify-center mb-4">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#003BC4] mb-3">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                        {/* Considerations */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#00B7AA] transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-[#003BC4] mb-4 flex items-center">
                                <span className="w-3 h-3 rounded-full bg-[#003BC4] mr-3"></span>
                                Considerations
                            </h2>
                            <p className="text-gray-600 mb-4">
                        	Dental veneers offer a <b>fast and effective cosmetic solution</b>, delivering a flawless,
                             natural-looking smile that boosts confidence. With different types to suit your 
                             needs—from durable porcelain to economical composites—they offer a tailored path to your dream smile.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    <span className="text-gray-600">Veneers are irreversible (except no-prep types)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    <span className="text-gray-600">May require replacement after 10–15 years</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    <span className="text-gray-600">Not suitable for severely damaged teeth</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    <span className="text-gray-600">Initial tooth sensitivity is common</span>
                                </li>
                            </ul>
                        </div>

                        {/* Care Instructions */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#00B7AA] transition-colors duration-200">
                            <h2 className="text-xl font-semibold text-[#003BC4] mb-4 flex items-center">
                                <span className="w-3 h-3 rounded-full bg-[#00B7AA] mr-3"></span>
                                Care Instructions
                            </h2>
                            <p className="text-gray-600 mb-4">
                                To ensure long-lasting results, follow these essential care guidelines:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    <span className="text-gray-600">Brush and floss daily with a soft toothbrush</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    <span className="text-gray-600">Avoid hard foods, and limit stain-causing substances</span>
                                </li>
                                {/* <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    <span className="text-gray-600">Limit stain-causing substances</span>
                                </li> */}
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    <span className="text-gray-600">Regular dental checkups recommended</span>
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
                                Dental veneers offer a fast and effective cosmetic solution, delivering a flawless, natural-looking smile that boosts confidence. With different types to suit your needs—from durable porcelain to economical composites—they offer a tailored path to your dream smile.
                            </p>
                            <Button btnContent="Schedule Your Appointment" link="/Appointment"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DentalVeneers;