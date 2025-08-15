import { useState, useEffect, Fragment } from 'react';
import { Switch, Transition } from '@headlessui/react';
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
    } catch {
      setError('Failed to load hours of operation.');
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
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError('Failed to update hours of operation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          aria-hidden="true"
          className="h-8 w-8 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"
        />
        <span
          className="ml-3 font-medium text-blue-600"
          role="status"
          aria-live="polite"
        >
          Loading hours...
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="mb-6 border-b border-gray-100 pb-2 text-xl font-bold text-gray-800">
        Hours of Operation
      </h3>

      <Transition
        as={Fragment}
        show={!!error}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        {error ? (
          <div
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            <p>{error}</p>
          </div>
        ) : null}
      </Transition>

      <Transition
        as={Fragment}
        show={!!successMessage}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 -translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-1"
      >
        {successMessage ? (
          <div
            className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            role="status"
            aria-live="polite"
          >
            <p>{successMessage}</p>
          </div>
        ) : null}
      </Transition>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Day
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-700 uppercase">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {hours.map((day, index) => (
                <tr key={day.day} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {day.day}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={day.isOpen}
                        onChange={(val: boolean) =>
                          handleHoursChange(index, 'isOpen', val)
                        }
                        className={`${
                          day.isOpen ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                        aria-label={`${day.day} open status`}
                      >
                        <span
                          className={`${
                            day.isOpen ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition`}
                        />
                      </Switch>
                      <span className="text-sm font-medium text-gray-700">
                        {day.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={day.hours}
                      onChange={e =>
                        handleHoursChange(index, 'hours', e.target.value)
                      }
                      disabled={!day.isOpen}
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                      aria-label={`${day.day} hours`}
                      className={`w-full rounded-2xl border px-3 py-2 text-sm shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
            className="inline-flex cursor-pointer items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-blue-400"
            aria-busy={saving}
          >
            {saving ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0A12 12 0 000 12h4z"
                  />
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
