import React from 'react';
import { Link } from 'react-router-dom';

const Insurance = () => {
  return (
    <main className="pt-[80px] font-poppins bg-white">

      {/* Banner Section */}
      <section
        className="relative w-full h-[450px] flex flex-col items-center justify-center text-center bg-cover bg-center px-4 sm:px-6"
        style={{ backgroundImage: "url('/insuranceBanner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-10 max-w-3xl text-white px-4 font-poppins">
          <h2 className="text-[42px] sm:text-[56px] md:text-[64px] lg:text-[70px] font-bold leading-tight mb-2 font-poppins">
            Insurance
          </h2>

          <div className="flex justify-center mb-4">
            <div className="h-0.5 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[490px] bg-white rounded-full"></div>
          </div>

          <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] leading-relaxed font-poppins">
            We accept major insurance plans and offer flexible payment options.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-poppins">
        <section className="mb-10">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-poppins">
            At <strong className="font-poppins">Allright Dental</strong>, we understand that the cost of dental care can be a concern for many patients.
            That’s why we’re committed to making high-quality treatment accessible and affordable. We offer flexible financing
            options through trusted vendors and a variety of convenient payment plans to fit your budget. Before any procedure
            begins, we provide clear, upfront cost estimates—so you’ll never be caught off guard by your bill. Your oral health
            matters, and we’re here to help you receive the care you need without financial stress.
          </p>
        </section>

        <section className="mb-10 font-poppins">
          <div className="bg-white rounded-2xl shadow-xl border p-6 sm:p-8 md:p-10 transition-all duration-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#003BC4] mb-6 text-center tracking-wide relative font-poppins">
              Insurances We Accept
              <span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 h-1 w-20 bg-[#003BC4] rounded-full"></span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 font-poppins">
              {[
                "Aetna", "Careington", "Metlife", "Teamsters",
                "Cigna", "Keystone First", "United Health Care", "Health Partners",
                "Delta Dental", "United Health Care comm plan", "United Concordia", "UPMC",
                "Guardian", "Liberty Dental", "Blue Cross / Blue Shield", "Aetna Better Health",
                "Humana", "Amerihealth", "Principal Life Insurance", "Dentemax",
                "Ameritas", "Sunlife Financial"
              ].map((insurance, index) => (
                <div
                  key={index}
                  className="bg-gray-50 text-gray-800 px-4 py-3 sm:py-5 rounded-xl shadow-md border text-sm sm:text-base hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-in-out text-center font-medium font-poppins"
                >
                  {insurance}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10 font-poppins">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-poppins">
            For patients who have little or no dental insurance coverage, flexible payment programs can be arranged through us
            or through dental financing companies. If you have no insurance or do not have dental benefits, there is still a way
            for you to receive dental care. We do offer convenient payment options, in-office plans are available. 
            So, please don't hesitate to contact our office at Allright Dental if you have any questions. Remember,
             we will work with you to help you get the dental care you need. 
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4 font-poppins">
          If you have any questions about insurance, please call  (215) 295-1348 today to see what other options are available at Allright Dental!
          </p>
        </section>
 
        <section className="bg-[#003BC4] text-white p-6 rounded-xl text-center font-poppins">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 font-poppins">Have Questions About Insurance?</h3>
          <p className="text-base sm:text-lg mb-4 font-poppins">
            Call us at <a href="tel:2152951348" className="underline font-bold font-poppins">(215) 295-1348</a> to learn more about your options.
          </p>
          <Link to="/contactus">
  <button className="bg-white text-[#003BC4] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition font-poppins">
    Contact Us
  </button>
</Link>
        </section>
      </div>
    </main>
  );
};

export default Insurance;
