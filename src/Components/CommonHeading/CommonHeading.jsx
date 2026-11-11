import React from 'react';

function CommonHeading({ mainContent, className }) {
  return (
    <div className={`relative w-full mb-12 ${className}`}>
      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
        {/* Main heading text with gradient and shine effect */}
        <span className="relative inline-block">
          {/* Gradient text */}
          <span className="text-transparent bg-clip-text bg-[#003BC4]">
            {mainContent}
          </span>
          {/* Shine effect on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/80 to-white/30 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
        </span>
      </h2>
      
      {/* Decorative elements */}
      <div className="flex justify-center items-center mt-2">
        {/* Left decorative line */}
        <div className="sm:block h-1 w-16 bg-gradient-to-r from-transparent to-[#00B7AA] mr-4"></div>
        
        {/* Center icon */}
        <div className="relative">
          <svg 
            className="md:w-8 md:h-8 h-5 w-5 text-[#003BC4]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
          <div className="absolute -inset-2 rounded-full border-2 border-[#00B7AA]/30 animate-ping opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        {/* Right decorative line */}
        <div className=" sm:block h-1 w-16 bg-gradient-to-l from-transparent to-[#003BC4] ml-4"></div>
      </div>
    </div>
  );
}

export default CommonHeading;