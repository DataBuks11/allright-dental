import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import Button from '../../Components/Button/Button';

function OrthodonticTreatment() {
    return (
        <>
            <div className='w-full bg-blue-50 relative py-16 px-6 lg:px-0 font-poppins pt-[80px]'>
                <div className="max-w-[1140px] mx-auto container">
                    <CommonHeading mainContent="Orthodontic Treatment" className="mt-10" />
                    <div className="relative bg-white mb-16 overflow-hidden rounded-2xl border border-[#00B7AA] ">
                        <div className="relative  rounded-[15px] p-8">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-semibold text-[#003BC4]">
                                    Orthodontic Treatment with Clear Aligners
                                </h2>
                            </div>
                            <p className="text-gray-600 mb-6">
                            Clear aligners are a modern orthodontic solution designed to straighten teeth discreetly and comfortably. Unlike traditional metal braces, clear aligners are made from smooth, transparent plastic and are custom-fitted to each patient's teeth. They are removable, allowing for easier maintenance of oral hygiene and the freedom to eat without dietary restrictions. 
                            </p>
                        </div>
                        <div className='relative p-4'>
                            <img src="/orthodontic.jpg" alt="" loading='lazy' className='w-full object-cover' />
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="relative mb-16 py-12 px-6 rounded-3xl overflow-hidden">
                        <div className="relative">
                            <h2 className="text-2xl font-semibold text-center mb-6">
                                <span className="text-[#003BC4]">
                                    How Clear Aligners Work
                                </span>
                            </h2>
                            <p className="text-gray-600 mb-12">
                            Clear aligners gradually shift teeth into their desired positions by applying gentle, controlled pressure. Each set of aligners is typically worn for 20 to 22 hours a day and replaced every one to two weeks as treatment progresses. Advanced digital imaging technology is used to create a series of aligners tailored to the patient's specific dental needs. Treatment duration varies but generally ranges from six months to two years, depending on the complexity of the case
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        step: "1",
                                        title: "Custom Digital Scan",
                                        desc: "Advanced imaging creates a precise 3D model of your teeth for custom aligners"
                                    },
                                    {
                                        step: "2",
                                        title: "Gradual Alignment",
                                        desc: "Each set of aligners gently shifts teeth into position over 1-2 weeks"
                                    },
                                    {
                                        step: "3",
                                        title: "Final Result",
                                        desc: "Achieve your perfect smile in 6-24 months with regular progress checks"
                                    }
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                                    >
                                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00B7AA] opacity-5 rounded-full blur-lg"></div>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#003BC4] text-center mb-3">{item.title}</h3>
                                        <p className="text-gray-600 text-center">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4] relative">
                                Benefits of Clear Aligners
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Aesthetic Appeal",
                                    desc: "Their nearly invisible appearance makes them a popular choice for individuals seeking a discreet orthodontic option."
                                },
                                {
                                    title: "Comfort",
                                    desc: "The smooth plastic design reduces irritation to the gums and cheeks, offering a more comfortable experience compared to traditional braces."
                                },
                                {
                                    title: "Removability",
                                    desc: "Aligners can be taken out during meals and while brushing or flossing, promoting better oral hygiene and eliminating food restrictions."
                                },
                                {
                                    title: "Predictable Treatment",
                                    desc: "Digital treatment planning allows patients to visualize the expected outcome before starting, providing a clear roadmap for their orthodontic journey."
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#003BC4]/10 to-[#00B7AA]/10 flex items-center justify-center text-[#00B7AA] text-xl mb-4">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-[#003BC4]">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Considerations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-red-100">
                            <h2 className="text-2xl font-semibold text-[#003BC4] mb-4 flex items-center">
                                
                                Considerations
                            </h2>
                            <p className="text-gray-600 mb-4">
                            While clear aligners are effective for many orthodontic issues, they may not be suitable for complex cases involving significant bite problems or severe misalignments. It's essential to consult with a qualified orthodontist to determine if clear aligners are the right treatment option.
                            </p>
                            {/* <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    May not work for complex bite problems
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    Requires discipline to wear 20-22 hours daily
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#003BC4] mr-2">•</span>
                                    Not ideal for severe misalignments
                                </li>
                            </ul> */}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border border-green-100">
                            <h2 className="text-2xl font-semibold text-[#003BC4] mb-4 flex items-center">
                                
                                Care Instructions
                            </h2>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    Wear aligners 20-22 hours per day
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    Clean aligners with approved solutions
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    Brush teeth after eating before reinserting
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#00B7AA] mr-2">•</span>
                                    Attend all scheduled check-ups
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
                                Clear aligners offer a discreet, comfortable way to straighten teeth without metal braces.
                                They provide excellent results for many orthodontic cases when used as directed by your orthodontist.
                            </p>
                            <Button btnContent="Schedule Your Consultation" link="/contactus"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrthodonticTreatment;