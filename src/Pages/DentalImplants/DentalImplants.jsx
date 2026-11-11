import React from 'react';
import { Link } from 'react-router-dom';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import { MdWarning, MdHealthAndSafety, MdClose, MdCheckCircle } from "react-icons/md";
import { MdArrowForward } from "react-icons/md";
function DentalImplants() {
    const benefits = [
        {
            title: "Natural Look & Function",
            desc: "They mimic the feel and performance of real teeth.",
        },
        {
            title: "Preserve Jawbone",
            desc: "Prevents bone loss by stimulating the underlying bone.",
        },
        {
            title: "Durability",
            desc: "With proper care, implants boast a success rate of 90–95% and can last decades.",
        },
        {
            title: "Protect Adjacent Teeth",
            desc: "Unlike bridges, they don't require reducing neighboring teeth.",
        },
    ];
    return (
        <>
            <div className='w-full px-6 bg-blue-50 lg:px-0 py-16 font-poppins pt-[80px]'>
                <div className="max-w-[1140px] mx-auto container">
                    {/* Hero Section */}
                    <div className="text-center mb-16 relative">

                        <CommonHeading mainContent="Dental Implants" className="mt-10" />

                    </div>

                    {/* What Are Dental Implants */}
                    <div className="relative mb-16 bg-white  overflow-hidden rounded-2xl border border-[#00B7AA]">

                        <div className="relative rounded-[15px] p-8">
                            <div className="flex items-center mb-6">

                                <h2 className="lg:text-2xl text-xl font-semibold text-[#003BC4]">
                                    What Are Dental Implants?
                                </h2>
                            </div>
                            <p className="text-gray-600 lg:text-lg mb-6">
                                Dental implants are artificial tooth roots—usually made of titanium or zirconia—surgically placed into the jawbone.
                                They fuse with the bone (a process called osseointegration), providing a sturdy foundation for artificial teeth
                                like crowns, bridges, or dentures.
                            </p>
                        </div>

                        <div className='py-6 px-6'>
                            <img src="/dentalImplants.jpg" alt="" />
                        </div>
                    </div>

                    {/* Why Choose Implants */}
                    <div className="mb-20">
                        <h2 className="text-2xl font-bold text-center mb-14 text-[#003BC4] relative">
                            Why Choose Dental Implants?
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-[#00B7AA] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative"
                                >


                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-[#003BC4] group-hover:text-[#00B7AA] transition-colors mb-2">
                                        {item.title}
                                    </h3>
                                    {/* Gradient Accent Line */}
                                    <div className="w-12 h-1 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] rounded-full mb-5"></div>
                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* The 3 Step Process */}
                    <div className="relative mb-16 py-12 px-6 rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                        <div className="relative">
                            <h2 className="text-2xl font-semibold text-center mb-12">
                                <span className="text-[#003BC4]">The 3-Step Implant Process</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        step: "1",
                                        title: "Consultation & Prep",
                                        desc: "Includes exams and imaging; may involve bone grafting if needed"
                                    },
                                    {
                                        step: "2",
                                        title: "Implant Placement",
                                        desc: "The surgical insertion of the post, followed by a healing period of 2–6 months for osseointegration"
                                    },
                                    {
                                        step: "3",
                                        title: "Abutment & Crown",
                                        desc: "Once healed, an abutment is attached, then a custom crown restores function and aesthetics"
                                    }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                                    >
                                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00B7AA] opacity-5 rounded-full blur-lg"></div>
                                        <div className="flex items-center mb-6">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-lg mr-4">
                                                {item.step}
                                            </div>
                                            <h3 className="text-xl font-semibold text-[#003BC4]">{item.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-6">{item.desc}</p>
                                        <div className="w-full h-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] rounded-full"
                                                style={{ width: `${(parseInt(item.step) / 3) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-[#003BC4] group-hover:text-[#00B7AA] transition-colors flex justify-end">
                                            <MdArrowForward className="w-6 h-6" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Risks & Considerations */}
                        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold text-[#003BC4] mb-6">
                                <div className="flex items-center gap-3">
                                    <MdWarning className="text-[#FF4D4F] text-2xl" />
                                    Risks & Considerations
                                </div>
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <MdClose className="text-red-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Common issues include infection, nerve damage</h4>
                                        <p className="text-gray-600">If not placed properly</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MdClose className="text-red-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Implant loosening</h4>
                                        <p className="text-gray-600">If oral hygiene is poor</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MdClose className="text-red-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Bone grafting may be required</h4>
                                        <p className="text-gray-600">If jawbone is insufficient</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MdClose className="text-red-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Recovery may involve</h4>
                                        <p className="text-gray-600">swelling, minor bleeding, and a soft-food diet for a few days</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Aftercare & Maintenance */}
                        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg shadow-md transition-all duration-300">
                            <h2 className="text-2xl font-semibold text-[#003BC4] mb-6">
                                <div className="flex items-center gap-3">
                                    <MdHealthAndSafety className="text-[#00B7AA] text-2xl" />
                                    Aftercare & Maintenance
                                </div>
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <MdCheckCircle className="text-green-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Oral hygiene</h4>
                                        <p className="text-gray-600">Daily brushing and flossing</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MdCheckCircle className="text-green-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Regular check-ups</h4>
                                        <p className="text-gray-600">Dental visits every 6 months</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MdCheckCircle className="text-green-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Diet adjustment</h4>
                                        <p className="text-gray-600">Soft-food diet after surgery</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MdCheckCircle className="text-green-500 mt-1 text-xl" />
                                    <div>
                                        <h4 className="font-medium text-gray-800">Avoid smoking</h4>
                                        <p className="text-gray-600">To promote healing</p>
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
                            Dental implants offer a long-lasting, natural-feeling solution for missing teeth. They support jaw health,
                             protect adjacent teeth, and—when well cared for—can last a lifetime. However, success hinges on good 
                             oral health, thorough planning, and diligent aftercare. For personalized guidance, consult with your
                              dentist to determine if implants are the right choice for you.
                            </p>
                            <Link to="/contactus">
  <button className="bg-white text-[#003BC4] font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
    Consult Your Dentist Today
  </button>
</Link>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DentalImplants;