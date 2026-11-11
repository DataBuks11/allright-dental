import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaCalendarCheck, FaClock, FaMapMarkerAlt, FaUserPlus, FaFileInvoiceDollar, FaTooth } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    id: 'new-patients',
    icon: FaUserPlus,
    question: "Are you accepting new patients?",
    answer: "Yes, absolutely! We are warmly accepting new patients of all ages — individuals and entire families. For your first visit, Dr. Shalini Mandapatti conducts a comprehensive dental examination, low-dose digital X-rays, and a gentle preventative cleaning. We can get you registered and scheduled right away!"
  },
  {
    id: 'working-hours',
    icon: FaClock,
    question: "What are your office hours and Saturday timings?",
    answer: "Our clinic operating hours are:\n• Monday, Wednesday, Thursday, Friday: 10:00 AM – 5:00 PM\n• Tuesday: Closed\n• Saturday: 9:00 AM – 12:00 PM strictly (Morning appointments only, clinic closes at 12:00 PM noon)\n• Sunday: Closed (On-call for urgent dental emergencies)"
  },
  {
    id: 'clinic-address',
    icon: FaMapMarkerAlt,
    question: "Where is Allright Dental located?",
    answer: "We are conveniently located at 229 Plaza Blvd. Suite 23, Morrisville, PA 19067. Our office features easy ground-floor access with ample free storefront parking directly in front of our entrance. You can reach our front desk directly at (215) 295-1348."
  },
  {
    id: 'book-reschedule',
    icon: FaCalendarCheck,
    question: "Can I book or reschedule my appointment online or by voice?",
    answer: "Yes! You have multiple convenient ways to book or reschedule:\n1. Online Booking: Click 'Book Appointment' in the top menu to choose your preferred service and time.\n2. 24/7 AI Voice Receptionist Sarah: Click the floating voice widget at the bottom right or visit our Voice Receptionist page to speak naturally with Sarah anytime to book or reschedule in under 60 seconds!\n3. Direct Call: Speak with our friendly front desk team at (215) 295-1348 during office hours."
  },
  {
    id: 'insurance-payment',
    icon: FaFileInvoiceDollar,
    question: "What dental insurances and payment plans do you accept?",
    answer: "We are in-network with and accept all major PPO dental insurances, including Principal Life, Delta Dental, MetLife, Cigna, Aetna, Guardian, United Healthcare, Humana, and Keystone First. For uninsured patients or treatments not fully covered by insurance, we offer CareCredit with flexible 0% interest financing."
  },
  {
    id: 'dental-services',
    icon: FaTooth,
    question: "What treatments and dental services do you provide?",
    answer: "We offer complete general, restorative, cosmetic, and emergency dentistry, including:\n• Routine Exams & Gentle Cleanings (Prophylaxis & Deep Scaling)\n• Tooth-Colored Fillings & Root Canal Therapy\n• Dental Crowns, Bridges & Dentures\n• Dental Implants & Bone Grafting\n• Teeth Whitening & Porcelain Veneers\n• Clear Aligners / Orthodontic Solutions\n• Urgent Same-Day Emergency Relief for toothaches, broken teeth, or infections."
  },
  {
    id: 'emergency-care',
    icon: FaTooth,
    question: "What should I do if I have a dental emergency?",
    answer: "If you are experiencing severe tooth pain, swelling, a broken tooth, a knocked-out tooth, or trauma, please call us immediately at (215) 295-1348. We reserve priority same-day emergency slots during operating days to get you out of pain immediately."
  }
];

export default function FAQSection() {
  const [openId, setOpenId] = useState('new-patients');

  const toggleFAQ = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-blue-50/60 to-white font-poppins relative overflow-hidden" id="faq-section">
      <div className="container mx-auto max-w-[1140px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-[#003BC4] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3">
            <FaQuestionCircle className="text-base text-[#00B7AA]" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003BC4] to-[#00B7AA]">We've Got Answers</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about our dental office hours, location, new patient visits, insurance, and booking or rescheduling with Dr. Shalini Mandapatti.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? "bg-white border-[#00B7AA] shadow-lg ring-1 ring-[#00B7AA]/20"
                    : "bg-white/80 hover:bg-white border-gray-200/80 shadow-sm hover:shadow"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? "bg-gradient-to-r from-[#003BC4] to-[#00B7AA] text-white shadow-md"
                          : "bg-blue-50 text-[#003BC4]"
                      }`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <span className="font-semibold text-gray-900 text-base sm:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-gray-400 pl-2">
                    {isOpen ? <FaChevronUp className="text-[#00B7AA]" /> : <FaChevronDown />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100/80">
                    <p className="whitespace-pre-line pl-14">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 max-w-3xl mx-auto bg-gradient-to-r from-[#003BC4] to-[#00B7AA] rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold mb-1">Still Have Questions or Ready to Schedule?</h4>
            <p className="text-blue-100 text-sm">
              Speak live with Sarah, our 24/7 AI Voice Receptionist, or call our clinic directly at (215) 295-1348.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              to="/Appointment"
              className="bg-white text-[#003BC4] hover:bg-gray-100 px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Book Online
            </Link>
            <Link
              to="/voice-receptionist"
              className="bg-white/20 hover:bg-white/30 border border-white/40 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Talk to Sarah 🎙️
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
