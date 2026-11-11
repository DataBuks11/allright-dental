import React from 'react';
import { Link } from 'react-router-dom';
import CommonBanner from '../../Components/CommonBanner/CommonBanner';
import CommonHeading from '../../Components/CommonHeading/CommonHeading';

const blogPosts = [
  {
    id: 1,
    image: '/blogOne.jpg',
    category: 'Preventive Care',
    date: 'March 28, 2025',
    title: 'The Importance of Routine Dental Cleanings',
    excerpt: 'Regular dental cleanings help prevent cavities, gum disease, and other oral issues. Learn why you shouldn’t skip them.',
  },
  {
    id: 2,
    image: '/blogTwo.jpg',
    category: 'Cosmetic Dentistry',
    date: 'April 2, 2025',
    title: 'Teeth Whitening: What You Need to Know',
    excerpt: 'Considering teeth whitening? Here’s what you need to know about methods, safety, and maintaining your bright smile.',
  },
  {
    id: 3,
    image: '/blogThree.jpg',
    category: 'Pediatric Dentistry',
    date: 'March 18, 2025',
    title: 'Caring for Your Child’s Teeth: A Parent’s Guide',
    excerpt: 'From baby teeth to braces, discover essential tips to protect and care for your child’s dental health.',
  },
];

function Blog() {
  return (
    <main className="pt-[80px] font-poppins">
      <CommonBanner
        backgroundImage="/blogBanner.jpg"
        className="bg-center"
        title="Dental Blog"
        subtitle="Your guide to dental health and wellness"
      />

      <section className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-[1140px]">
          <CommonHeading
            mainContent="Latest Dental Tips & Updates"
            subContent="Stay informed with helpful articles and expert advice"
          />

          <p className="text-center text-gray-600 max-w-xl mx-auto mt-4 mb-12">
            Discover how to keep your smile healthy and beautiful with our expert-backed articles on dental care and oral hygiene.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    to="/contactus"
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                  >
                    Read More
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Blog;
