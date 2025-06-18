import React, { useState } from 'react';
import BouncyPillButton from '../UI/BouncyPillButton';

// Example component showing how to use the BouncyPillButton
const ButtonUsageExample: React.FC = () => {
  const categories = ['Ramen', 'Shave Ice', 'Acai', 'Hot Dogs'];
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  const switchCategory = (category: string) => {
    setCurrentCategory(category);
    // Additional logic here...
  };

  // Helper function to get specific style for each category when active
  const getButtonActiveStyle = (category: string): string => {
    const styles: Record<string, string> = {
      'Ramen': 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
      'Shave Ice': 'bg-cyan-400 text-indigo-900 border-cyan-600 shadow-[0_8px_0_rgb(6,182,212)] hover:shadow-[0_4px_0px_rgb(6,182,212)] hover:translate-y-1',
      'Acai': 'bg-purple-500 text-white border-purple-700 shadow-[0_8px_0_rgb(109,40,217)] hover:shadow-[0_4px_0px_rgb(109,40,217)] hover:translate-y-1',
      'Hot Dogs': 'bg-red-400 text-indigo-900 border-red-600 shadow-[0_8px_0_rgb(220,38,38)] hover:shadow-[0_4px_0px_rgb(220,38,38)] hover:translate-y-1'
    };
    return styles[category] || 'bg-indigo-500 text-white border-indigo-700 shadow-[0_4px_0_rgb(67,56,202)]';
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 p-8">
      {categories.map((category) => (
        <BouncyPillButton
          key={category}
          text={category}
          isActive={currentCategory === category}
          activeStyle={getButtonActiveStyle(category)}
          onClick={() => switchCategory(category)}
        />
      ))}
      
      {/* Example with custom className */}
      <BouncyPillButton
        text="Custom Style"
        onClick={() => alert('Custom button clicked!')}
        className="mt-8 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-pink-700"
      />
    </div>
  );
};

export default ButtonUsageExample;
