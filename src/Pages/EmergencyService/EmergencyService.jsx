import React from 'react';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';
import Button from '../../Components/Button/Button';

function EmergencyService() {
    return (
        <div className='w-full bg-blue-50 relative px-6 lg:px-0 py-16 pt-[80px] font-poppins'>
            <div className="max-w-[1140px] mx-auto container">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <CommonHeading mainContent="Emergency Dental Services" className="mt-10" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3">
                    <b>Emergency dental services</b> are specialized treatments provided to address urgent dental problems that require immediate attention. These situations often involve severe pain, bleeding, trauma, or infection and cannot wait for a routine dental appointment.
                    </p>
                </div>

                {/* Emergency Banner */}
                <div className="relative mb-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[#003BC4] to-[#00B7AA] p-6 text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-xl font-bold mb-1">Dental Emergency?</h2>
                            <p className="text-blue-100 text-sm">We provide quick care for urgent dental needs</p>
                        </div>
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                                <p className="text-xs text-blue-100">Emergency Hotline</p>
                                <a href="#" className="text-lg font-bold hover:text-white transition">(215) 295-1348</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Common Emergencies */}
                <div className="mb-16">
                    <h2 className="text-xl font-semibold text-center mb-10 text-[#003BC4]">
                        Common Dental Emergencies
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                           {
                            title: "Toothaches",
                            desc: "Persistent or severe tooth pain due to decay, abscess, or infection.",
                            icon: "🦷",
                            action: "Apply cold compress and call us"
                        },
                        {
                            title: "Knocked-out Tooth",
                            desc: "Immediate care can potentially save the tooth.",
                            icon: "⚡",
                            action: "Keep in milk and reach us fast"
                        },
                        {
                            title: "Chipped or Broken Tooth",
                            desc: "Especially if it causes pain or exposes nerves.",
                            icon: "⚠️",
                            action: "Rinse with water and bring pieces"
                        },
                        {
                            title: "Lost Dental Fillings or Crowns",
                            desc: "Can lead to sensitivity or further damage.",
                            icon: "🛠️",
                            action: "Avoid chewing on that side and contact us"
                        },
                        {
                            title: "Dental Abscess",
                            desc: "A painful infection that can spread if untreated.",
                            icon: "🔥",
                            action: "Rinse with salt water and seek immediate care"
                        },
                        {
                            title: "Bleeding Gums or Mouth Injuries",
                            desc: "From accidents or underlying health issues.",
                            icon: "💧",
                            action: "Apply gentle pressure and visit urgently"
                        },
                        {
                            title: "Swelling of Face or Jaw",
                            desc: "Often linked to infections that may need urgent treatment.",
                            icon: "😷",
                            action: "Stay upright and consult immediately"
                        }
                        
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-5 rounded-xl shadow border hover:shadow-md transition">
                                <div className="flex items-start mb-3">
                                    <div className="text-2xl mr-3">{item.icon}</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#003BC4]">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-2 rounded mt-2 text-sm text-[#003BC4] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {item.action}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Care & Prevention */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-lg font-semibold text-[#003BC4] mb-4">What to Expect</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✓ Pain relief and diagnosis</li>
                            <li>✓ Same-day treatment</li>
                            <li>✓ Stabilization of your issue</li>
                            <li>✓ Follow-up instructions</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-lg font-semibold text-[#003BC4] mb-4">How to Prevent</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✓ Regular check-ups</li>
                            <li>✓ Avoid chewing hard objects</li>
                            <li>✓ Wear sports mouthguards</li>
                            <li>✓ Address problems early</li>
                        </ul>
                    </div>
                    <div className="md:col-span-2 flex justify-center">
  <div className="bg-white p-6 rounded-xl border shadow-sm mt-6 max-w-xl w-full">
    <h3 className="text-lg font-semibold text-[#003BC4] mb-4 text-center">What to Do in a Dental Emergency</h3>
    <ul className="space-y-2 text-sm text-gray-700">
      <li>✓ <b>Call your dentist.</b></li>
      <li>✓ <b>Control bleeding</b> with clean gauze.</li>
      <li>✓ <b>Preserve any broken or knocked-out teeth</b> in milk or saline and bring them to the clinic.</li>
      <li>✓ <b>Apply cold compresses</b> to reduce swelling.</li>
    </ul>
  </div>
</div>


                </div>

                {/* Final CTA */}
                <div className="relative rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] opacity-10"></div>
                    <div className="relative z-10 p-10 text-center text-white">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Don’t Wait in Pain</h2>
                        <p className="text-blue-100 mb-6 max-w-xl mx-auto text-base sm:text-lg">
                        Allright Dental is here for you in case of dental emergencies.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button btnContent="Book Emergency Visit" link="/contactus" className="bg-transparent border-2 border-white text-white hover:bg-white/10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmergencyService;
