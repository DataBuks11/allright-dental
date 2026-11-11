import React, { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaUser,
  FaEnvelope,
  FaCommentDots
} from 'react-icons/fa';
import CommonHeading from '../CommonHeading/CommonHeading';

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  

  const [popup, setPopup] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://allrightdental.com/Backend_Dental/contact_us.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setPopup({ message: 'Thank you! We will get back to you soon.', type: 'success' });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
        
      } else {
        setPopup({ message: 'Failed to send message', type: 'error' });
      }

    } catch (error) {
      setPopup({ message: 'An error occurred. Please try again later.', type: 'error' });
    }

    setTimeout(() => {
      setPopup({ message: '', type: '' });
    }, 2500);
  };

  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-0 py-12 sm:py-16 font-poppins bg-blue-50 overflow-hidden">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <CommonHeading mainContent="Get In Touch" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Contact Form Section */}
          <div className="w-full flex flex-col justify-center lg:w-1/2 p-6 sm:p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 animate-fade-in-up">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#003BC4] mb-6 pb-4 relative group">
              Send Us a Message
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-[#00B7AA] to-[#003BC4] transition-all duration-500 group-hover:w-24"></span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="relative">
    <label className="block mb-1 font-medium">First Name</label>
    <div className="flex items-center border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-[#00B7AA]">
      <FaUser className="text-[#00B7AA] mr-3" />
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Your First Name"
        required
        className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
      />
    </div>
  </div>

  <div className="relative">
    <label className="block mb-1 font-medium">Last Name</label>
    <div className="flex items-center border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-[#00B7AA]">
      <FaUser className="text-[#00B7AA] mr-3" />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Your Last Name"
        required
        className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
      />
    </div>
  </div>

              {/* Email */}
              <div className="relative">
                <label className="block mb-1 font-medium">Email Address</label>
                <div className="flex items-center border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-[#00B7AA]">
                  <FaEnvelope className="text-[#00B7AA] mr-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your Email"
                    required
                    className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="relative">
                <label className="block mb-1 font-medium">Phone Number</label>
                <div className="flex items-center border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-[#00B7AA]">
                  <FaPhone className="text-[#00B7AA] mr-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: value });
                    }}
                    placeholder="Enter your Phone Number"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                    className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <label className="block mb-1 font-medium">Message</label>
                <div className="flex items-start border rounded-xl px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm focus-within:ring-2 focus-within:ring-[#00B7AA]">
                  <FaCommentDots className="text-[#00B7AA] mt-1 mr-3" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="How can we help you?"
                    required
                    className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#003BC4] to-[#00B7AA] hover:from-[#00B7AA] hover:to-[#003BC4] text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="rounded-xl overflow-hidden shadow-md h-[300px] sm:h-[350px] lg:h-[400px]">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.987072538478!2d-74.83215092407078!3d40.0009659714761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3911f8b1a0a5b%3A0x3d7e0a1e8a5e5b1e!2s229%20Plaza%20Blvd%20Ste%2023%2C%20Morrisville%2C%20PA%2019067!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-100">
              <h2 className="text-2xl font-bold text-[#00B7AA] mb-6 text-center">
                Allright Dental
              </h2>
              <div className="space-y-6">
                {/* Address and Phone */}
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#00B7AA] p-3 rounded-lg text-white flex-shrink-0">
                      <FaMapMarkerAlt className="text-lg" />
                    </div>
                    <p className="text-gray-700">
                      229 Plaza Blvd Ste 23, Morrisville, PA 19067
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-[#00B7AA] p-3 rounded-lg text-white flex-shrink-0">
                      <FaPhone className="text-lg" />
                    </div>
                    <p className="text-gray-700">(215) 295-1348</p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-gradient-to-r from-[#003BC4]/5 to-[#00B7AA]/5 p-5 sm:p-6 rounded-lg border-2 border-[#00B7AA]/30 relative overflow-hidden">
                  <h4 className="text-lg sm:text-xl font-bold text-[#003BC4] mb-3">Opening Hours</h4>
                  <div className="space-y-3">
                    {[
                      { day: "Monday", time: "10:00 AM – 5:00 PM" },
                      { day: "Tuesday", time: "Closed" },
                      { day: "Wednesday", time: "10:00 AM – 5:00 PM" },
                      { day: "Thursday", time: "10:00 AM – 5:00 PM" },
                      { day: "Friday", time: "10:00 AM – 5:00 PM" },
                      { day: "Saturday", time: "9:00 AM – 12:00 PM (Morning Only)" },
                      { day: "Sunday", time: "Closed (Urgent Emergency Care)" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start pb-2 border-b border-gray-200/50"
                      >
                        <div className="flex items-center gap-3">
                          <FaClock className="text-xl text-[#00B7AA]" />
                          <span className="font-semibold text-gray-700">{item.day}</span>
                        </div>
                        <span className="font-medium text-gray-700">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Message */}
      {popup.message && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
          px-6 py-4 rounded-lg text-white shadow-lg text-lg font-semibold
          ${popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
          animate-fade-in-up`}>
          {popup.message}
        </div>
      )}
    </div>
  );
}

export default ContactForm;
