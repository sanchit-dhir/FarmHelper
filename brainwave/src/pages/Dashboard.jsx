// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: false,
  timeout: 30000 // 30 second timeout
});

export default function Dashboard() {
  const [locality, setLocality] = useState('');
  const [cropType, setCropType] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [soilType, setSoilType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);

  // Enable submit only when all required fields are non-empty
  const isComplete = Boolean(
    locality.trim() &&
    cropType.trim() &&
    growthStage.trim() &&
    soilType.trim()
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isComplete) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    setResp(null);

    try {
      const token = localStorage.getItem('token');

      const res = await api.post(
        '/api/ai/soil',
        {
          locality: locality.trim(),
          cropType: cropType.trim(),
          growthStage: growthStage.trim(),
          soilType: soilType.trim(),
          message: message.trim() || ''
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      // Validate response structure
      if (!res.data) {
        throw new Error('No data received from server');
      }

      if (!res.data.data) {
        toast.error('Unexpected response format');
        return;
      }

      setResp(res.data.data);
      toast.success('Advisory generated successfully');

    } catch (err) {
      console.error('API Error:', err);

      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout - please try again');
      } else if (err.response) {
        // Server responded with error
        const msg = err.response.data?.message || `Error: ${err.response.status}`;
        toast.error(msg);
      } else if (err.request) {
        // Request made but no response
        toast.error('No response from server - check your connection');
      } else {
        // Other errors
        toast.error(err.message || 'Request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setLocality('');
    setCropType('');
    setGrowthStage('');
    setSoilType('');
    setMessage('');
    setResp(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Soil Advisory</h1>
          {(resp || locality || cropType || growthStage || soilType || message) && (
            <button
              onClick={clearForm}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition"
            >
              Clear All
            </button>
          )}
        </div>

        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col">
            <label htmlFor="locality" className="text-sm font-medium mb-1">
              Locality <span className="text-red-500">*</span>
            </label>
            <input
              id="locality"
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g., Pune, Maharashtra"
              className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cropType" className="text-sm font-medium mb-1">
              Crop type <span className="text-red-500">*</span>
            </label>
            <input
              id="cropType"
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g., Wheat"
              className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="growthStage" className="text-sm font-medium mb-1">
              Growth stage <span className="text-red-500">*</span>
            </label>
            <input
              id="growthStage"
              type="text"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              placeholder="e.g., Vegetative"
              className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="soilType" className="text-sm font-medium mb-1">
              Soil type <span className="text-red-500">*</span>
            </label>
            <input
              id="soilType"
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              placeholder="e.g., Loamy"
              className="border rounded p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              required
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label htmlFor="message" className="text-sm font-medium mb-1">
              Message (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Specific concerns, recent weather, issues observed..."
              className="border rounded p-3 h-28 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
              maxLength={1000}
            />
            <span className="text-xs text-gray-500 mt-1">
              {message.length}/1000 characters
            </span>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={!isComplete || loading}
              aria-disabled={!isComplete || loading}
              title={!isComplete ? 'Fill all required fields' : undefined}
              className={`px-6 py-3 rounded font-semibold transition
                ${!isComplete || loading
                  ? 'bg-indigo-600/60 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Get Advisory'
              )}
            </button>
          </div>
        </form>

        {/* Response rendering */}
        {resp && (
          <section className="mt-8 grid gap-6">
            {/* Overview */}
            {resp.overview && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-gray-700 whitespace-pre-line">{resp.overview}</p>
              </div>
            )}

            {/* Fertilizer recommendations */}
            {Array.isArray(resp.fertilizer_recommendations) && resp.fertilizer_recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Fertilizer Recommendations</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left border font-semibold">Type</th>
                        <th className="px-3 py-2 text-left border font-semibold">Quantity</th>
                        <th className="px-3 py-2 text-left border font-semibold">Unit</th>
                        <th className="px-3 py-2 text-left border font-semibold">Application Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resp.fertilizer_recommendations.map((f, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          <td className="px-3 py-2 border">{f.type || '—'}</td>
                          <td className="px-3 py-2 border">
                            {typeof f.quantity === 'number' ? f.quantity : (f.quantity || '—')}
                          </td>
                          <td className="px-3 py-2 border">{f.unit || '—'}</td>
                          <td className="px-3 py-2 border">{f.application_time || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Organic alternatives */}
            {Array.isArray(resp.organic_alternatives) && resp.organic_alternatives.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Organic Alternatives</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {resp.organic_alternatives.map((item, i) => (
                    <li key={i} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Irrigation advice */}
            {resp.irrigation_advice && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Irrigation Advice</h2>
                <p className="text-gray-700 whitespace-pre-line">{resp.irrigation_advice}</p>
              </div>
            )}

            {/* Soil health tips */}
            {Array.isArray(resp.soil_health_tips) && resp.soil_health_tips.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-3">Soil Health Tips</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {resp.soil_health_tips.map((tip, i) => (
                    <li key={i} className="text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Caution */}
            {Array.isArray(resp.caution) && resp.caution.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <h2 className="text-xl font-semibold mb-3 text-red-700">⚠️ Caution</h2>
                <ul className="list-disc pl-6 space-y-2 text-red-700">
                  {resp.caution.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty state */}
            {!resp.overview &&
              (!resp.fertilizer_recommendations || resp.fertilizer_recommendations.length === 0) &&
              (!resp.organic_alternatives || resp.organic_alternatives.length === 0) &&
              !resp.irrigation_advice &&
              (!resp.soil_health_tips || resp.soil_health_tips.length === 0) &&
              (!resp.caution || resp.caution.length === 0) && (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600">No advisory data available in the response.</p>
                </div>
              )}
          </section>
        )}
      </div>
    </div>
  );
}