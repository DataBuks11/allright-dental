import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTooth, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { NavLink, Link } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";

function Footer() {
  const services = [
    { name: 'Dental Implants', href: '/dental-implants' },
    { name: 'Dental Veneers', href: '/dental-veneers' },
    { name: 'Endodontic Treatments', href: '/endodontic-treatments' },
    { name: 'Orthodontic Treatment', href: '/orthodontic-treatments' },
    { name: 'Teeth Whitening', href: '/teeth-whitening' },
    { name: 'Periodontic Treatment', href: '/periodontic-treatments' },
    { name: 'Dentures', href: '/dentures' },
    { name: 'Emergency Dental Services', href: '/emergency-service' },
  ];

  return (
    <footer className="bg-gradient-to-r from-[#003BC4] to-[#00B7AA] w-full relative px-6 lg:px-0 font-poppins text-white py-12">
      <div className="container mx-auto max-w-[1140px] grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {/* Logo and Contact Section */}
        <div>
          <div className="flex items-center mb-4">
            <FaTooth className="text-3xl mr-2" />
            <span className="text-2xl font-bold">Allright Dental</span>
          </div>
          <p className="mb-6">Your trusted partner for exceptional dental care and beautiful smiles.</p>

          <div className="space-y-3">
            <div className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-3 flex-shrink-0" />
              <p>229 Plaza Blvd Ste 23 Morrisville, PA 19067</p>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-3" />
              <p>(215) 295-1348</p>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="mr-3" />
              <a href="#">contact@allrightdental.com</a>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-white/20">Our Services</h2>
          <ul className="space-y-3">
            {services.map((item, index) => (
              <li key={index} className="flex items-center transition-colors">

                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `hover:text-[#00B7AA] transition-colors ${isActive ? 'text-[#00B7AA] font-medium' : 'text-white'}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>


        </div>

        {/* Quick Links Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-white/20">Quick Links</h2>
          <ul className="space-y-3">
            <li>
              <NavLink
                to="/about-doctor"
                className="hover:text-[#00B7AA] transition-colors text-white"
              >
                About Doctor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/reviews"
                className="hover:text-[#00B7AA] transition-colors text-white"
              >
                Reviews
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className="hover:text-[#00B7AA] transition-colors text-white"
              >
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contactus"
                className="hover:text-[#00B7AA] transition-colors text-white"
              >
                Contact Us
              </NavLink>
            </li>
          </ul>

          <Link to="/Appointment">
  <button className="flex items-center bg-white text-[#003BC4] px-4 mt-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
    <FaCalendarAlt className="mr-2" />
    Book an Appointment
  </button>
</Link>

        </div>

        {/* Newsletter and Social Links */}
        <div>
          <h2 className="text-xl font-bold mb-6 pb-2 border-b-2 border-white/20">Newsletter</h2>
          <p className="mb-4">Subscribe to our newsletter for the latest updates and dental tips.</p>

          <div className="mb-6">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#00B7AA]"
            />
            <button className="w-full mt-2 bg-[#003BC4] hover:bg-[#002a8f] text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/p/All-Right-Dental-100049384311563/" target='_blank' className="bg-white/20 hover:bg-white/30 p-3 rounded-full text-xl transition-colors">
              <FaFacebook />
            </a>
            <a href="#" className="bg-white/20 hover:bg-white/30 p-3 rounded-full text-xl transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="bg-white/20 hover:bg-white/30 p-3 rounded-full text-xl transition-colors">
              <FaXTwitter />
            </a>
            <a href="#" className="bg-white/20 hover:bg-white/30 p-3 rounded-full text-xl transition-colors">
              <FaLinkedin />
            </a>
            <a href="https://g.page/r/CdefQU2t37gCEB0/review" target='_blank' className="bg-white/20 hover:bg-white/30 p-3 rounded-full text-xl transition-colors">
              <FaGoogle />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-12 pt-6 border-t border-white/20">
        <p>&copy; {new Date().getFullYear()} Developed by TAGRAB LLC. All Rights Reserved. | <a href="#" className="hover:text-[#00B7AA] transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-[#00B7AA] transition-colors">Terms of Service</a></p>
      </div>
    </footer>
  );
}

export default Footer;