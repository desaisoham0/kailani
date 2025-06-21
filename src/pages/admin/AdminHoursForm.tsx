import { useState, useEffect } from 'react';
import { getHoursOfOperation, updateHoursOfOperation } from '../../firebase/hoursService';
import type { DayHours } from '../../firebase/hoursService';

export default function AdminHoursForm() {
  const [hours, setHours] = useState<DayHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      setLoading(true);
      const hoursData = await getHoursOfOperation();
      setHours(hoursData.days);
    } catch (err) {
      setError('Failed to load hours of operation.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHoursChange = (index: number, field: keyof DayHours, value: string | boolean) => {
    setHours(prevHours => {
      const newHours = [...prevHours];
      newHours[index] = { ...newHours[index], [field]: value };
      return newHours;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    try {
      setSaving(true);
      await updateHoursOfOperation(hours);
      setSuccessMessage('Hours of operation updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update hours of operation. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 text-blue-600 font-medium">Loading hours...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
        Hours of Operation
      </h3>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-md p-4 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-md p-4 text-sm text-green-700">
          <p>{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 font-medium text-gray-700">Day</th>
                <th className="px-4 py-2 font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 font-medium text-gray-700">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {hours.map((day, index) => (
                <tr key={day.day} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{day.day}</td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={day.isOpen}
                        onChange={(e) => handleHoursChange(index, 'isOpen', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {day.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={day.hours}
                      onChange={(e) => handleHoursChange(index, 'hours', e.target.value)}
                      disabled={!day.isOpen}
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                      className={`w-full py-2 px-3 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none transition-colors ${
                        !day.isOpen ? 'bg-gray-100 text-gray-500' : 'bg-white'
                      }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400 transition-colors flex items-center"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Hours'}
          </button>
        </div>
      </form>
    </div>
  );
}
