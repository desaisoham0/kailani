import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import aboutBanner from '../assets/illustrations/about-banner.svg';
import aboutStory from '../assets/illustrations/about-story.svg';
import aboutTeam from '../assets/illustrations/about-team.svg';
import aboutValues from '../assets/illustrations/about-values.svg';
import '../styles/aboutAnimations.css';

const AboutPage: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState('story');
  const [animateValues, setAnimateValues] = useState(false);
  
  // Trigger animation when the values section becomes visible
  useEffect(() => {
    if (activeTab === 'values') {
      setAnimateValues(true);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
      {/* Hero Banner */}
      <div className="relative h-80 md:h-96 overflow-hidden rounded-b-3xl shadow-md w-full max-w-full">
        <img 
          src={aboutBanner} 
          alt="About Kailani" 
          className="w-full h-full object-cover max-w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold jua-regular mb-2 drop-shadow-lg max-w-full">
            Our Story
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl nunito-sans max-w-xl drop-shadow-md px-4">
            The journey, passion, and people behind Kailani
          </p>
        </div>
        
        {/* Duolingo-style decorative elements */}
        {/* <div className="absolute left-5 bottom-5 bg-white rounded-full p-3 shadow-lg about-icon">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div> */}
        
        <div className="absolute right-5 bottom-5 bg-white rounded-full p-3 shadow-lg about-icon" style={{ animationDelay: '0.5s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>

      {/* Duolingo-style Tab Navigation */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full max-w-full overflow-x-hidden">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-center mb-8 w-full">
            <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2 bg-gray-100 p-2 rounded-xl max-w-full">
              <button 
                onClick={() => setActiveTab('story')}
                className={`px-3 sm:px-6 py-3 rounded-lg font-bold transition-all jua-regular text-sm sm:text-base min-w-0 cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ${
                  activeTab === 'story' 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                Our Story
              </button>
              <button 
                onClick={() => setActiveTab('team')}
                className={`px-3 sm:px-6 py-3 rounded-lg font-bold transition-all jua-regular text-sm sm:text-base min-w-0 cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ${
                  activeTab === 'team' 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                Our Team
              </button>
              <button 
                onClick={() => setActiveTab('values')}
                className={`px-3 sm:px-6 py-3 rounded-lg font-bold transition-all jua-regular text-sm sm:text-base min-w-0 cursor-pointer hover:scale-105 hover:shadow-lg duration-200 ${
                  activeTab === 'values' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                Our Values
              </button>
            </div>
          </div>

          {/* Content sections */}
          <div className="max-w-4xl mx-auto pb-16 w-full max-w-full overflow-x-hidden">
            
            {/* Our Story Section */}
            {activeTab === 'story' && (
              <div className="about-section">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 w-full">
                  <div className="w-full md:w-1/2">
                    <img src={aboutStory} alt="Our Story" className="w-full max-w-sm mx-auto max-w-full" />
                  </div>
                  <div className="w-full md:w-1/2 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 jua-regular duo-heading">How It All Began</h2>
                    <p className="text-gray-700 mb-4 nunito-sans">
                      Kailani was born from a deep love of Hawaiian and Pacific cuisine. Our founder, Chef Miriam and Chef Steven, grew up on the shores of Oahu where food was always at the center of family gatherings.
                    </p>
                    <p className="text-gray-700 mb-4 nunito-sans">
                      In 2015, after years of working in top restaurants across the country, Chef Kai decided to bring the flavors of home to the mainland with a modern twist.
                    </p>
                    <div className="bg-cyan-50 p-4 rounded-xl border-l-4 border-cyan-500">
                      <p className="italic text-gray-700 nunito-sans">
                        "Food is a universal language that brings people together. At Kailani, we want to share the aloha spirit through our dishes."
                      </p>
                      <p className="font-bold mt-2 text-gray-800">— Chef Miriam, Founder</p>
                    </div>
                  </div>
                </div>
                
                {/* Timeline */}
                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center jua-regular duo-heading">Our Journey</h2>
                  <div className="relative w-full">
                    {/* Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-amber-200 z-0"></div>

                    {/* Timeline items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                      {/* 2015 */}
                      <div className="md:col-start-2 relative about-card" style={{ animationDelay: '0.2s' }}>
                        {/* Dot */}
                        <div className="hidden md:block absolute -left-[42px] top-6 w-5 h-5 rounded-full bg-amber-500 border-4 border-amber-200 z-10"></div>
                        <div className="bg-amber-50 p-6 rounded-xl">
                          <h3 className="text-amber-600 text-xl font-bold mb-1 jua-regular">2015</h3>
                          <h4 className="text-gray-800 text-lg font-bold mb-2">First Pop-up</h4>
                          <p className="text-gray-700 nunito-sans">
                            Kailani started as a weekend pop-up at local farmers' markets, serving Hawaiian-inspired street food.
                          </p>
                        </div>
                      </div>
                      
                      {/* Empty space for layout */}
                      <div className="hidden md:block"></div>
                      
                      {/* 2017 */}
                      <div className="md:col-start-1 md:text-right relative about-card" style={{ animationDelay: '0.4s' }}>
                        {/* Dot */}
                        <div className="hidden md:block absolute -right-[42px] top-6 w-5 h-5 rounded-full bg-cyan-500 border-4 border-amber-200 z-10"></div>
                        <div className="bg-cyan-50 p-6 rounded-xl">
                          <h3 className="text-cyan-600 text-xl font-bold mb-1 jua-regular">2017</h3>
                          <h4 className="text-gray-800 text-lg font-bold mb-2">Food Truck Launch</h4>
                          <p className="text-gray-700 nunito-sans">
                            After gaining popularity, we expanded with our first food truck, "Kailani On Wheels".
                          </p>
                        </div>
                      </div>
                      
                      {/* 2020 */}
                      <div className="md:col-start-2 relative about-card" style={{ animationDelay: '0.6s' }}>
                        {/* Dot */}
                        <div className="hidden md:block absolute -left-[42px] top-6 w-5 h-5 rounded-full bg-purple-500 border-4 border-amber-200 z-10"></div>
                        <div className="bg-purple-50 p-6 rounded-xl">
                          <h3 className="text-purple-600 text-xl font-bold mb-1 jua-regular">2020</h3>
                          <h4 className="text-gray-800 text-lg font-bold mb-2">Pivoting Through Challenges</h4>
                          <p className="text-gray-700 nunito-sans">
                            During the pandemic, we adapted with a successful meal kit delivery service, bringing Hawaiian flavors to homes.
                          </p>
                        </div>
                      </div>
                      
                      {/* Empty space for layout */}
                      <div className="hidden md:block"></div>
                      
                      {/* 2022 */}
                      <div className="md:col-start-1 md:text-right relative about-card" style={{ animationDelay: '0.8s' }}>
                        {/* Dot */}
                        <div className="hidden md:block absolute -right-[42px] top-6 w-5 h-5 rounded-full bg-green-500 border-4 border-amber-200 z-10"></div>
                        <div className="bg-green-50 p-6 rounded-xl">
                          <h3 className="text-green-600 text-xl font-bold mb-1 jua-regular">2022</h3>
                          <h4 className="text-gray-800 text-lg font-bold mb-2">Restaurant Opening</h4>
                          <p className="text-gray-700 nunito-sans">
                            We finally opened our first brick-and-mortar location, bringing the full Kailani experience to life.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Join Us CTA */}
                <div className="bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl p-8 text-center shadow-lg">
                  <h3 className="text-white text-2xl font-bold mb-4 jua-regular">Come Be Part of Our Story!</h3>
                  <p className="text-white mb-6 max-w-md mx-auto nunito-sans">
                    We're continually growing and would love for you to join us on this journey.
                  </p>
                  <a 
                    href="https://order.toasttab.com/online/kailanishaveice" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="duo-button no-underline inline-block"
                    onClick={() => {
                        // Try to add vibration feedback on mobile
                        if (navigator.vibrate) {
                        navigator.vibrate(100);
                        }
                    }}
                    >
                    Visit Us Today
                    </a>
                </div>
              </div>
            )}

            {/* Our Team Section */}
            {activeTab === 'team' && (
              <div className="about-section w-full max-w-full overflow-x-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 w-full">
                  <div className="w-full md:w-1/2 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 jua-regular duo-heading">Meet Our Ohana</h2>
                    <p className="text-gray-700 mb-4 nunito-sans">
                      At Kailani, we're more than just colleagues – we're a family (ohana). Our diverse team brings together talents from various backgrounds, united by our passion for great food and aloha spirit.
                    </p>
                    <p className="text-gray-700 mb-6 nunito-sans">
                      From our kitchen staff to our servers, each team member plays a crucial role in creating the warm, welcoming experience that defines Kailani.
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-5 rounded-full bg-cyan-500 flex-shrink-0"></div>
                      <p className="font-bold text-gray-800">5+ Team Members</p>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-5 rounded-full bg-amber-500 flex-shrink-0"></div>
                      <p className="font-bold text-gray-800">5+ Nationalities</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-purple-500 flex-shrink-0"></div>
                      <p className="font-bold text-gray-800">100% Passionate About Food</p>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <img src={aboutTeam} alt="Our Team" className="w-full max-w-sm mx-auto max-w-full" />
                  </div>
                </div>
                
                {/* Team cards */}
                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center jua-regular duo-heading">Key Team Members</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Chef Kai */}
                    <div className="about-card bg-white rounded-xl overflow-hidden shadow-lg" style={{ animationDelay: '0.2s' }}>
                      <div className="bg-amber-500 h-3"></div>
                      <div className="p-6">
                        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-1 jua-regular">Chef Miriam</h3>
                        <p className="text-amber-600 text-center mb-4">Founder & Head Chef</p>
                        <p className="text-gray-700 text-center nunito-sans">
                          Born and raised in Hawaii, Chef Kai brings authentic island flavors with a modern twist to every dish.
                        </p>
                      </div>
                    </div>
                    
                    {/* Leilani */}
                    <div className="about-card bg-white rounded-xl overflow-hidden shadow-lg" style={{ animationDelay: '0.4s' }}>
                      <div className="bg-cyan-500 h-3"></div>
                      <div className="p-6">
                        <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-1 jua-regular">Steven</h3>
                        <p className="text-cyan-600 text-center mb-4">Restaurant Manager</p>
                        <p className="text-gray-700 text-center nunito-sans">
                          With 10+ years in hospitality, Leilani ensures every guest feels the warmth of Hawaiian hospitality.
                        </p>
                      </div>
                    </div>
                    
                    {/* Chef Mike */}
                    <div className="about-card bg-white rounded-xl overflow-hidden shadow-lg" style={{ animationDelay: '0.6s' }}>
                      <div className="bg-purple-500 h-3"></div>
                      <div className="p-6">
                        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-1 jua-regular">Chef Diya</h3>
                        <p className="text-purple-600 text-center mb-4">Sous Chef</p>
                        <p className="text-gray-700 text-center nunito-sans">
                          A culinary innovator who blends traditional techniques with bold flavors to create unique dishes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Join Our Team CTA */}
                <div className="bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl p-8 text-center shadow-lg">
                  <h3 className="text-white text-2xl font-bold mb-4 jua-regular">Join Our Ohana!</h3>
                  <p className="text-white mb-6 max-w-md mx-auto nunito-sans">
                    We're always looking for passionate individuals to join our growing team.
                  </p>
                  <Link to="/jobs" className="duo-button blue no-underline inline-block">
                    View Open Positions
                  </Link>
                </div>
              </div>
            )}

            {/* Our Values Section */}
            {activeTab === 'values' && (
              <div className="about-section w-full max-w-full overflow-x-hidden">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 w-full">
                  <div className="w-full md:w-1/2 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 jua-regular duo-heading">What We Stand For</h2>
                    <p className="text-gray-700 mb-4 nunito-sans">
                      At Kailani, our values are inspired by the Hawaiian concept of "Pono" – doing what is right, in the right way, at the right time, for the right reason.
                    </p>
                    <p className="text-gray-700 mb-6 nunito-sans">
                      These principles guide every decision we make, from sourcing ingredients to serving our customers.
                    </p>
                    
                    {/* Value pills */}
                    <div className="flex flex-wrap mb-4">
                      <span className="value-pill value-green">Aloha Spirit</span>
                      <span className="value-pill value-blue">Authenticity</span>
                      <span className="value-pill value-yellow">Community</span>
                      <span className="value-pill value-pink">Sustainability</span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <img src={aboutValues} alt="Our Values" className="w-full max-w-sm mx-auto max-w-full" />
                  </div>
                </div>
                
                {/* Values details */}
                <div className="my-16 w-full max-w-full overflow-x-hidden">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center jua-regular duo-heading">Our Core Values</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Aloha Spirit */}
                    <div className={`about-card bg-white rounded-xl overflow-hidden shadow-lg ${animateValues ? 'animate-value' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-3"></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold jua-regular">Aloha Spirit</h3>
                        </div>
                        <p className="text-gray-700 nunito-sans">
                          We treat everyone who walks through our doors as family, sharing the warmth and hospitality that Hawaii is known for.
                        </p>
                        
                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="progress-bar mt-2">
                            <div className="progress-bar-fill bg-green-500" style={{ width: animateValues ? '100%' : '0%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Authenticity */}
                    <div className={`about-card bg-white rounded-xl overflow-hidden shadow-lg ${animateValues ? 'animate-value' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3"></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold jua-regular">Authenticity</h3>
                        </div>
                        <p className="text-gray-700 nunito-sans">
                          We stay true to traditional Hawaiian flavors and techniques while also embracing innovation and creative cooking.
                        </p>
                        
                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="progress-bar mt-2">
                            <div className="progress-bar-fill bg-blue-500" style={{ width: animateValues ? '95%' : '0%', transitionDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Community */}
                    <div className={`about-card bg-white rounded-xl overflow-hidden shadow-lg ${animateValues ? 'animate-value' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3"></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold jua-regular">Community</h3>
                        </div>
                        <p className="text-gray-700 nunito-sans">
                          We actively engage with our local community through partnerships, events, and giving back initiatives.
                        </p>
                        
                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="progress-bar mt-2">
                            <div className="progress-bar-fill bg-yellow-500" style={{ width: animateValues ? '90%' : '0%', transitionDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sustainability */}
                    <div className={`about-card bg-white rounded-xl overflow-hidden shadow-lg ${animateValues ? 'animate-value' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                      <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-3"></div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold jua-regular">Sustainability</h3>
                        </div>
                        <p className="text-gray-700 nunito-sans">
                          We prioritize environmentally conscious practices, from sourcing local ingredients to minimizing waste.
                        </p>
                        
                        {/* Progress bar */}
                        <div className="mt-4">
                          <div className="progress-bar mt-2">
                            <div className="progress-bar-fill bg-pink-500" style={{ width: animateValues ? '85%' : '0%', transitionDelay: '0.6s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Visit Us CTA */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-8 text-center shadow-lg">
                  <h3 className="text-white text-2xl font-bold mb-4 jua-regular">Experience Our Values in Action!</h3>
                  <p className="text-white mb-6 max-w-md mx-auto nunito-sans">
                    Visit us to see how our values shape everything we do, from our welcoming atmosphere to our delicious food.
                  </p>
                  <a
                    href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="duo-button purple no-underline inline-block"
                    onClick={() => {
                        // Try to add vibration feedback on mobile
                        if (navigator.vibrate) {
                        navigator.vibrate(100);
                        }
                    }}
                    >
                    Find Us 
                    </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AboutPage;
