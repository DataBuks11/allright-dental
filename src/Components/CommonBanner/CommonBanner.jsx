import React from 'react';

function CommonBanner({ title, subtitle, backgroundImage, className }) {
  return (
    <div
      className={`relative w-full h-[40vh] sm:h-[60vh] md:h-[70vh] min-h-[260px] bg-cover bg-center flex items-center justify-center ${className || ''}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Text Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold border-b-2 pb-3 sm:pb-4">{title}</h1>
        {subtitle && <p className="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl">{subtitle}</p>}
      </div>
    </div>
  );
}

export default CommonBanner;
