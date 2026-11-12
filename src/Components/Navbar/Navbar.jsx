import React, { useState } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSpecializationOpen, setIsMobileSpecializationOpen] = useState(false);

  const navItems = [
    { name: 'About Doctor', href: '/about-doctor' },
    {
      name: 'Specialization',
      href: '/Specialization',
      subItems: [
        { name: 'Dental Implants', href: '/dental-implants' },
        { name: 'Dental Veneers', href: '/dental-veneers' },
        { name: 'Endodontic Treatments', href: '/endodontic-treatments' },
        { name: 'Orthodontic Treatment', href: '/orthodontic-treatments' },
        { name: 'Teeth Whitening', href: '/teeth-whitening' },
        { name: 'Periodontic Treatment', href: '/periodontic-treatments' },
        { name: 'Dentures', href: '/dentures' },
        { name: 'Emergency Dental Services', href: '/emergency-service' },
      ]
    },
    { name: 'Insurance', href: '/Insurance' },
    { name: 'AI Receptionist', href: '/voice-receptionist' },
    { name: 'Patient Form', href: '/patient-form' },
    { name: 'Blog', href: '/blog' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact Us', href: '/contactus' },
  ];
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm w-full h-16 sm:h-20 px-4 sm:px-6 lg:px-8 font-poppins transition-all duration-300">
      <div className="container mx-auto max-w-[1140px]">
        <div className="flex justify-between  items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center  flex-shrink-0">
            <img
              src="/Allright_Dental_Logo_Redesign-removebg-preview.png"
              alt="Logo"
              className="w-36 sm:w-48 cursor-pointer object-contain"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#003BC4] hover:text-[#00B7AA] hover:bg-gray-100 focus:outline-none transition duration-300"
              aria-expanded={isMobileMenuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navItems.map((item) => (
              item.subItems ? (
                <div
                  key={item.name}
                  className="relative group"
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `relative px-4 py-2 text-sm lg:text-base font-medium rounded-md transition-all duration-300 flex items-center ${isActive
                        ? 'text-[#003BC4] font-semibold'
                        : 'text-gray-700 hover:text-[#00B7AA]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        <FiChevronDown className="ml-1 transition-transform duration-200 group-hover:rotate-180" />
                        <span className={`absolute left-1/2 -bottom-1 w-0 h-0.5 bg-[#00B7AA] transition-all duration-300 transform -translate-x-1/2 group-hover:w-4/5 ${isActive ? 'w-4/5' : ''
                          }`}></span>
                      </>
                    )}
                  </NavLink>

                  {/* Dropdown menu - using CSS hover */}
                  <div className="absolute left-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top">
                    <div className="py-1">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#00B7AA]/10 hover:text-[#00B7AA] transition-colors duration-200"
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm lg:text-base font-medium rounded-md transition-all duration-300 group ${isActive
                      ? 'text-[#003BC4] font-semibold'
                      : 'text-gray-700 hover:text-[#00B7AA]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      <span className={`absolute left-1/2 -bottom-1 w-0 h-0.5 bg-[#00B7AA] transition-all duration-300 transform -translate-x-1/2 group-hover:w-4/5 ${isActive ? 'w-4/5' : ''
                        }`}></span>
                    </>
                  )}
                </NavLink>
              )
            ))}
           <Button
  btnContent="Book an Appointment"
  link="/Appointment"
  className="whitespace-nowrap flex justify-center items-center w-[220px] h-[48px] text-center"
/>

          </div>
        </div>
      </div>

      {/* Mobile Nav Items */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[calc(100dvh-5rem)] overflow-y-auto shadow-xl border-b border-gray-100' : 'max-h-0 overflow-hidden'
        }`}>
        <div className="px-3 pt-2 pb-6 space-y-1 bg-white">
          {navItems.map((item, index) => (
            item.subItems ? (
              <div key={item.name}>
                <div
                  className="flex items-center justify-between px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-[#00B7AA]/10 hover:text-[#00B7AA] cursor-pointer transition-colors duration-300"
                  onClick={() => setIsMobileSpecializationOpen(!isMobileSpecializationOpen)}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : '0ms' }}
                >
                  <span>{item.name}</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isMobileSpecializationOpen ? 'transform rotate-180' : ''}`} />
                </div>

                <div className={`pl-4 overflow-hidden transition-all duration-300 ${isMobileSpecializationOpen ? 'max-h-96' : 'max-h-0'}`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <NavLink
                      key={subItem.name}
                      to={subItem.href}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActive
                          ? 'bg-[#003BC4]/10 text-[#003BC4] font-semibold'
                          : 'text-gray-700 hover:bg-[#00B7AA]/10 hover:text-[#00B7AA]'
                        }`
                      }
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileSpecializationOpen(false);
                      }}
                      style={{ transitionDelay: isMobileSpecializationOpen ? `${subIndex * 50}ms` : '0ms' }}
                    >
                      {subItem.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `block px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${isActive
                    ? 'bg-[#003BC4]/10 text-[#003BC4] font-semibold'
                    : 'text-gray-700 hover:bg-[#00B7AA]/10 hover:text-[#00B7AA]'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ transitionDelay: isMobileMenuOpen ? `${index * 75}ms` : '0ms' }}
              >
                {item.name}
              </NavLink>
            )
          ))}
          <div className="pt-2 pb-1">
            <Button btnContent="Book an Appointment" link="/Appointment" className="w-full text-center flex justify-center py-3"/>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;