import React, { useState, useEffect } from 'react';

// 1. Feature Data Array (Used for state management)
const featuresData = [
  {
    title: "Explore Best Offers",
    description: "Helps businesses get discovered by local customers through accurate and optimized listings.",
    icon: '🛍️',
    image: "../../src/assets/img/in-offers.png", // High-res placeholder
  },
  {
    title: "Find Nearby Local Experts",
    description: "Keeps customers informed about deals and promotions from local businesses.",
    icon: '📅',
    image: "../../src/assets/img/in-events.png", // Placeholder for Events image (like the concert)
  },
  {
    title: "Trending Offers and Professional",
    description: "Allows users to directly call, chat, or book services through the platform.",
    icon: '🔥',
    image: "../../src/assets/img/in-trending.png",
  },
  {
    title: "Community Engagement",
    description: "Connect with local businesses and like-minded people to share experiences and recommendations.",
    icon: '💬',
    image: "../../src/assets/img/in-community.png",
  },
];

const SmartFeaturesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // 2. useEffect and setInterval for Automatic Cycling (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        (prevIndex + 1) % featuresData.length
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentImage = featuresData[activeIndex].image;
  const currentTitle = featuresData[activeIndex].title;

  // --- FIX APPLIED HERE: Simplified the right column layout ---
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-16">
          Smart Features Designed for You
        </h2>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          
          {/* LEFT COLUMN: Feature List (No Changes Needed Here) */}
          <div className="w-full lg:w-1/2 space-y-8">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-xl cursor-pointer transition-all duration-300 ease-in-out
                  ${index === activeIndex 
                    ? 'bg-red-50 ring-2 ring-red-400 shadow-md' 
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4 text-xl">
                    {feature.icon}
                  </div>
                  
                  <div>
                    <h3 className={`text-xl font-bold ${index === activeIndex ? 'text-red-600' : 'text-gray-800'}`}>
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            <button className="mt-8 px-6 py-3 font-semibold text-white rounded-full 
              bg-gradient-to-r from-orange-400 to-pink-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
              Find more offers
            </button>

          </div>

          {/* RIGHT COLUMN: Dynamic Image and Phone Mockup (FIXED) */}
          <div className="w-full lg:w-1/2 flex justify-center mt-10 lg:mt-0 relative h-[400px] md:h-[500px]">
            
            {/* 1. Background Image Container (Z-index 10) */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4/5 h-4/5 rounded-3xl overflow-hidden z-10">
              <img
                key={activeIndex}
                src={currentImage}
                alt={currentTitle}
                className="w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-100 animate-fade-in"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFeaturesSection;