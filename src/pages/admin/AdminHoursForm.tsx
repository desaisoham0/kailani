import { useState, useEffect } from 'react';
import {
  getHoursOfOperation,
  updateHoursOfOperation,
} from '../../firebase/hoursService';
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

  const handleHoursChange = (
    index: number,
    field: keyof DayHours,
    value: string | boolean
  ) => {
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
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 font-medium text-blue-600">Loading hours...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        Hours of Operation
      </h3>

      {error && (
        <div className="mb-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-md border-l-4 border-green-500 bg-green-50 p-4 text-sm text-green-700">
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
                    <label className="inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={day.isOpen}
                        onChange={e =>
                          handleHoursChange(index, 'isOpen', e.target.checked)
                        }
                        className="peer sr-only"
                      />
                      <div className="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                      <span className="ms-3 text-sm font-medium text-gray-700">
                        {day.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={day.hours}
                      onChange={e =>
                        handleHoursChange(index, 'hours', e.target.value)
                      }
                      disabled={!day.isOpen}
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                      className={`w-full rounded-md border px-3 py-2 transition-colors outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 ${
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
            className="focus:ring-opacity-50 flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-blue-400"
          >
            {saving ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Hours'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
