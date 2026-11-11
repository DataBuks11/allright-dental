import React, { useState } from 'react';
import CommonBanner from '../../Components/CommonBanner/CommonBanner';
import { FaQuoteLeft, FaArrowRight, FaArrowLeft, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';

const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Vishal Bargat",
      role: "Patient for 5 years",
      rating: 5,
      quote: "Dr. Shalini took the time to explain everything clearly and made me feel completely at ease. Whether it was a routine cleaning or a more complex procedure, I felt confident I was in excellent hands. The care and attention to detail were outstanding.",
      image: null, 
      highlight: "Pain-free experience"
    },
    {
      id: 2,
      name: "Colin O'Neill",
      role: "New Patient",
      rating: 5,
      quote: "Excellent, they’re always right on time, honest and quick. Highly recommended!",
      image: null, 
      highlight: "Perfect smile"
    },
    {
      id: 3,
      name: "Gambisi Mugabe",
      role: "Emergency Patient",
      rating: 5,
      quote: "Great service. The staff were very friendly and professional. My dental work turned out perfect.Thanks for your service.",
      image: null, 
      highlight: "Emergency care"
    },
    {
      id: 4,
      name: "Patricia Cox",
      role: "Emergency Patient",
      rating: 5,
      quote: "She is a wonderful doctor. Very pleasant her receptionist is awesome. She is a very nice lady. They take care of you there. Her dental assistant is so very nice. The whole office is just so nice. I would recommend them to anybody.",
      image: null, 
      highlight: "Perfect smile"
    },
    {
      id: 5,
      name: "Angelina Singh",
      role: "Emergency Patient",
      rating: 5,
      quote: "I have been going here for 3 years now and I have referred my boyfriend and mom here!! Great people great environment and great care💗 …",
      image: null, 
      highlight: "Emergency care"
    }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const getCardColor = (index) => {
    return index === 1 ? '#00B7AA' : '#003BC4';
  };

  return (
    <>
      <main className='pt-[80px]'>
        <CommonBanner
          backgroundImage="/reviewBanner.jpg"
          title="Patient Testimonials"
          subtitle="Hear what our patients say about their dental experiences"
          className="bg-right"
        />

        <section className="w-full relative font-poppins px-6 lg:px-0 py-16 bg-white">
          <div className="container max-w-[1140px] mx-auto">
            <CommonHeading
              mainContent="Smiles We've Brightened"
              subContent="Our patients share their Alright Dental experiences"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {reviews.map((review, index) => {
                const cardColor = getCardColor(index);

                return (
                  <motion.div
                    key={review.id}
                    whileHover={{ y: -5 }}
                    className={`bg-white p-8 rounded-xl shadow-md border-t-4`}
                    style={{ borderColor: cardColor }}
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white shadow-md bg-gray-100 flex items-center justify-center text-gray-600 text-2xl">
                        {review.image ? (
                          <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{review.name}</h4>
                        <p className="text-gray-500 text-sm">{review.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{review.quote}</p>
                    <div className="px-4 py-2 rounded-lg inline-block" style={{ backgroundColor: `${cardColor}1A` }}>
                      <span className="font-medium" style={{ color: cardColor }}>
                        {review.highlight}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="relative bg-gradient-to-r from-[#003BC4]/10 to-[#00B7AA]/10 rounded-3xl overflow-hidden mx-auto p-1 mb-16">
              <div className="bg-white rounded-2xl p-8 md:p-12">
                <motion.div
                  key={reviews[currentReview].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center"
                >
                  <div className="md:w-1/3 mb-8 md:mb-0">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-4 border-white shadow-xl mx-auto bg-gray-100 flex items-center justify-center text-gray-600 text-6xl">
                        {reviews[currentReview].image ? (
                          <img
                            src={reviews[currentReview].image}
                            alt={reviews[currentReview].name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <div className={`absolute -bottom-2 -right-2 ${currentReview === 1 ? 'bg-[#00B7AA]' : 'bg-[#003BC4]'} text-white rounded-full w-14 h-14 flex items-center justify-center font-bold text-lg shadow-lg`}>
                        {reviews[currentReview].rating}/5
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 md:pl-12">
                    <FaQuoteLeft className={`text-5xl mb-6 ${currentReview === 1 ? 'text-[#00B7AA]/20' : 'text-[#003BC4]/20'}`} />
                    <p className="text-2xl leading-relaxed text-gray-800 mb-8 font-light">
                      "{reviews[currentReview].quote}"
                    </p>
                    <div className="border-t pt-6">
                      <h4 className="text-2xl font-bold text-gray-900">{reviews[currentReview].name}</h4>
                      <p className={`${currentReview === 1 ? 'text-[#00B7AA]' : 'text-[#003BC4]'}`}>{reviews[currentReview].role}</p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex justify-center mt-10 space-x-4">
                  <button
                    onClick={prevReview}
                    className={`p-3 rounded-full ${currentReview === 1 ? 'bg-[#00B7AA]/10 text-[#00B7AA] hover:bg-[#00B7AA]/20' : 'bg-[#003BC4]/10 text-[#003BC4] hover:bg-[#003BC4]/20'} transition`}
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={nextReview}
                    className={`p-3 rounded-full ${currentReview === 1 ? 'bg-[#00B7AA]/10 text-[#00B7AA] hover:bg-[#00B7AA]/20' : 'bg-[#003BC4]/10 text-[#003BC4] hover:bg-[#003BC4]/20'} transition`}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-[#003BC4] to-[#00B7AA] rounded-2xl p-12 text-white">
              <h3 className="text-3xl font-bold mb-4">Share Your Dental Journey</h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto">We value your feedback about your experience at Alright Dental.</p>
              <button
                className="bg-white text-[#003BC4] hover:bg-gray-100 font-bold py-4 px-10 rounded-full shadow-lg transition transform hover:scale-105 text-lg"
                onClick={() =>
                  window.open(
                    'https://www.google.com/maps/place/ALLRIGHT+DENTAL/@40.2063586,-74.8012227,17z/data=!4m8!3m7!1s0x89c1574663337443:0x2b8dfad4d419fd7!8m2!3d40.2063586!4d-74.8012227!9m1!1b1!16s%2Fg%2F12hqyz0bz?entry=ttu&g_ep=EgoyMDI1MDYyMi4wIKXMDSoASAFQAw%3D%3D',
                    '_blank'
                  )
                }
              >
                Write a Review
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Reviews;
