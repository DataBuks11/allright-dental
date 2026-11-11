import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import Button from '../../Components/Button/Button';

function TeethWhitening() {
    return (
        <>
            <div className='w-full relative py-16 px-6 pt-[80px] font-poppins bg-blue-50'>
                <div className="max-w-[1140px] mx-auto container">
                    <CommonHeading mainContent="Teeth Whitening" className="mt-10"/>
                    <div className="relative mb-16 overflow-hidden border border-[#00B7AA] rounded-2xl bg-white">
                        <div className="relative rounded-[15px] p-8">
                            <div className="flex items-center mb-6">
                                <h2 className="text-2xl font-semibold text-[#003BC4]">
                                    Teeth Whitening: Enhance Your Smile
                                </h2>
                            </div>
                            <p className="text-gray-600 mb-6">
                            <b>Teeth whitening</b> is a popular cosmetic dental procedure aimed at lightening the color of teeth and removing stains or discoloration. It is one of the most sought-after treatments for achieving a brighter smile.
                            </p>
                        </div>
                        <div className='relative p-4'>
                            <img src="/teethWhitening.jpg" alt="" className='w-full'/>
                        </div>
                    </div>

                    {/* Methods */}
                    <div className="relative mb-16 py-12 px-6 rounded-3xl overflow-hidden">
                        <div className="relative">
                            <h2 className="text-2xl font-semibold text-center mb-12">
                                <span className="text-[#003BC4]">
                                    Methods of Teeth Whitening
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-2xl shadow-md transition-all duration-300 group relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00B7AA] opacity-5 rounded-full blur-lg"></div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-lg mb-4">
                                        1
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#003BC4] mb-3">In-Office Whitening</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#00B7AA] mr-2">•</span>
                                            <span>Performed by a dentist</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#00B7AA] mr-2">•</span>
                                            <span>Offers immediate results, often in just one visit.</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00B7AA] opacity-5 rounded-full blur-lg"></div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white flex items-center justify-center font-bold text-lg mb-4">
                                        2
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#003BC4] mb-3">At-Home Whitening Kits</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start">
                                            <span className="text-[#00B7AA] mr-2">•</span>
                                            <span>Custom-fitted trays with professional-grade whitening gel.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#00B7AA] mr-2">•</span>
                                            <span>More affordable and convenient, though results may take longer to appear.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-semibold text-center mb-12">
                            <span className="text-[#003BC4]  relative">
                                Benefits of Teeth Whitening
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Aesthetic Improvement",
                                    desc: "Achieves a brighter, more youthful-looking smile"
                                },
                                {
                                    title: "Boost in Confidence",
                                    desc: "Enhances self-esteem and social interactions"
                                },
                                {
                                    title: "Non-Invasive",
                                    desc: "Simple procedure with minimal discomfort"
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
<div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 mb-16">
  <h2 className="text-2xl sm:text-3xl font-semibold text-[#003BC4] mb-6 flex items-center">
    ⚠️ Considerations
  </h2>
  <ul className="space-y-4 text-gray-700 leading-relaxed">
    <li className="flex items-start">
      <span className="text-[#00B7AA] font-bold mr-2">•</span>
      <span>
        <strong>Temporary Sensitivity:</strong> Some individuals may experience mild tooth sensitivity.
      </span>
    </li>
    <li className="flex items-start">
      <span className="text-[#00B7AA] font-bold mr-2">•</span>
      <span>
        <strong>Not Suitable for All Stains:</strong> May not be effective on certain types of discoloration,
        such as intrinsic stains or existing restorations.
      </span>
    </li>
    <li className="flex items-start">
      <span className="text-[#00B7AA] font-bold mr-2">•</span>
      <span>
        <strong>Maintenance Required:</strong> Results can fade over time, especially with consumption of stain-causing foods and beverages.
      </span>
    </li>
  </ul>
</div>


                    {/* Summary */}
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                        <div className="relative z-10 p-12 text-center">
                            <h2 className="text-3xl font-bold text-white mb-6">In Summary</h2>
                            <p className="text-blue-100 mb-8 max-w-3xl mx-auto text-lg">
                                Professional teeth whitening offers a safe and effective way to brighten your smile. Whether you choose in-office treatment for immediate results or at-home kits for convenience, a whiter smile can boost your confidence and appearance.
                            </p>
                            <Button btnContent="Brighten Your Smile Today" link="/contactus"/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeethWhitening;