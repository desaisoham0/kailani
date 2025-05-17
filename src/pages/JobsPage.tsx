import Job from '../components/ApplyJob';
import { submitForm } from '../services/emailService';

const JobsPage = () => {
  const handleJobSubmit = async (formData: FormData) => {
    // Custom logic to submit the form data using our email service
    try {
      await submitForm(formData, 'job');
    } catch (error) {
      console.error('Error in job submission:', error);
      throw new Error('Failed to submit application');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold jua-regular text-gray-900 mb-4 relative inline-block">
            Join Our Team
            <span className="absolute -bottom-2 left-0 w-full h-2 bg-amber-300 opacity-50 rounded-full"></span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 nunito-sans text-lg">
            At Kailani, we're more than just colleagues - we're a family dedicated to creating exceptional dining experiences.
            If you're passionate about food, hospitality, and creating memorable moments, we'd love to hear from you!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 jua-regular">Competitive Pay</h3>
            <p className="text-gray-600">We offer competitive wages and opportunities for advancement as you grow with us.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 jua-regular">Friendly Team</h3>
            <p className="text-gray-600">Join our diverse and supportive team that works together like a family.</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md transform transition-all hover:-translate-y-2 hover:shadow-lg">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 jua-regular">Growth Opportunities</h3>
            <p className="text-gray-600">We believe in promoting from within and helping our employees develop their careers.</p>
          </div>
        </div>

        <Job 
          availablePositions={['Server', 'Chef', 'Host/Hostess', 'Manager', 'Bartender', 'Line Cook', 'Dishwasher']} 
          onSubmit={handleJobSubmit}
        />
      </div>
    </div>
  );
};

export default JobsPage;