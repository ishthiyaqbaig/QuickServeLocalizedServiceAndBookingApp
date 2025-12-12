import React from 'react';

// Define the data for the two columns/cards
const struggleData = {
  customer: {
    title: "Struggle For Customer",
    icon: '💔', // Example icon for visual interest
    issues: [
      "Lack of Awareness of offers & Business around",
      "Lack of Timely Support & Inconsistent Communication",
      "Trust issues to buy online directly",
      "Lack of Personal Touch",
    ],
  },
  business: {
    title: "Struggle For Business",
    icon: '💼', // Example icon for visual interest
    issues: [
      "Strong online competition from E-com and Quick-com giants",
      "Lack of digital marketing awareness & non-affordable cost",
      "Customer Data management & analysis",
      "Need for business digital presence",
      "Limited reach and visibility",
      "Excessive local competition",
    ],
  },
};

/**
 * Reusable Card Component for Struggles
 * @param {{ title: string, issues: string[], icon: string, imageSrc: string }} props
 */
const StruggleCard = ({ title, issues, icon, imageSrc }) => (
  // The max-w-sm or w-full ensures responsiveness and prevents the card from becoming too wide
  <div className="w-full lg:max-w-md mx-auto bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
    <div className="mb-4 rounded-t-lg overflow-hidden">
      {/* Image will take full width of the card's inner content area */}
      <img src={imageSrc} alt={title} className="w-full object-cover h-[250px]" />
    </div>
    
    <h3 className="text-xl font-bold mb-3 text-red-500 flex items-center px-4 md:px-6">
      <span className="mr-2 text-2xl">{icon}</span>
      {title}
    </h3>
    
    {/* List of issues using bullet points */}
    <ul className="space-y-2 text-gray-700 text-sm p-4 md:p-6 !pt-0">
      {issues.map((issue, index) => (
        <li key={index} className="flex items-start">
          <span className="text-red-500 mr-2 mt-1">•</span> {/* Custom bullet point */}
          <span>{issue}</span>
        </li>
      ))}
    </ul>
  </div>
);


const OfflineStruggleSection = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading: Horizontally Centered */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12 md:mb-16">
          The Offline Struggle
        </h2>

        {/* Two-Column Layout (Flexbox for centering and spacing) */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          
          {/* Card 1: Struggle For Customer */}
          <StruggleCard 
            title={struggleData.customer.title}
            issues={struggleData.customer.issues}
            icon={struggleData.customer.icon}
            // Placeholder for the image of the woman looking at the phone
            imageSrc="../../src/assets/img/customer-struggle.png" 
          />

          {/* Card 2: Struggle For Business */}
          <StruggleCard 
            title={struggleData.business.title}
            issues={struggleData.business.issues}
            icon={struggleData.business.icon}
            // Placeholder for the image of the woman with the laptop
            imageSrc="../../src/assets/img/business-struggle.png" 
          />
        </div>
      </div>
    </div>
  );
};

export default OfflineStruggleSection;