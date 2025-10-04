// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
    <div className="relative min-h-screen bg-n-8 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-n-8 via-n-7 to-n-6">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-color-1/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-color-2/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-color-3/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-color-1 to-color-2 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="h2 text-n-1">Soil Advisory</h1>
                <p className="body-2 text-n-3">Get personalized farming recommendations</p>
              </div>
            </div>
            {(resp || locality || cropType || growthStage || soilType || message) && (
              <button
                onClick={clearForm}
                className="px-4 py-2 text-sm text-n-3 hover:text-n-1 hover:bg-n-7/30 rounded-2xl transition-all duration-200"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Advisory Form */}
          <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl mb-8">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Locality Field */}
                <div className="space-y-2">
                  <label htmlFor="locality" className="text-sm font-medium text-n-2">
                    Locality <span className="text-color-3">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="locality"
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g., Pune, Maharashtra"
                      className="w-full pl-12 pr-4 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Crop Type Field */}
                <div className="space-y-2">
                  <label htmlFor="cropType" className="text-sm font-medium text-n-2">
                    Crop Type <span className="text-color-3">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <input
                      id="cropType"
                      type="text"
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      placeholder="e.g., Wheat"
                      className="w-full pl-12 pr-4 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Growth Stage Field */}
                <div className="space-y-2">
                  <label htmlFor="growthStage" className="text-sm font-medium text-n-2">
                    Growth Stage <span className="text-color-3">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <input
                      id="growthStage"
                      type="text"
                      value={growthStage}
                      onChange={(e) => setGrowthStage(e.target.value)}
                      placeholder="e.g., Vegetative"
                      className="w-full pl-12 pr-4 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Soil Type Field */}
                <div className="space-y-2">
                  <label htmlFor="soilType" className="text-sm font-medium text-n-2">
                    Soil Type <span className="text-color-3">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <input
                      id="soilType"
                      type="text"
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      placeholder="e.g., Loamy"
                      className="w-full pl-12 pr-4 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-n-2">
                  Message<span className="text-color-3">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specific concerns, recent weather, issues observed..."
                    className="w-full pl-12 pr-4 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200 resize-none h-28"
                    disabled={loading}
                    maxLength={1000}
                    required= {true}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-n-4">
                    {message.length}/1000 characters
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isComplete || loading}
                aria-disabled={!isComplete || loading}
                title={!isComplete ? 'Fill all required fields' : undefined}
                className="w-full py-4 px-6 bg-gradient-to-r from-color-1 to-color-2 text-white font-semibold rounded-2xl hover:from-color-1/90 hover:to-color-2/90 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:ring-offset-2 focus:ring-offset-n-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  "Get Advisory"
                )}
              </button>
            </form>
          </div>

          {/* Response rendering */}
          {resp && (
            <section className="grid gap-6">
              {/* Overview */}
              {resp.overview && (
                <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-color-1/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-color-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="h5 text-n-1">Overview</h2>
                  </div>
                  <p className="text-n-2 whitespace-pre-line leading-relaxed">{resp.overview}</p>
                </div>
              )}

              {/* Fertilizer recommendations */}
              {Array.isArray(resp.fertilizer_recommendations) && resp.fertilizer_recommendations.length > 0 && (
                <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-color-2/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-color-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h2 className="h5 text-n-1">Fertilizer Recommendations</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-n-5/30">
                          <th className="px-4 py-3 text-left text-sm font-medium text-n-2">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-n-2">Quantity</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-n-2">Unit</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-n-2">Application Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-n-5/20">
                        {resp.fertilizer_recommendations.map((f, i) => (
                          <tr key={i} className="hover:bg-n-7/30 transition-colors">
                            <td className="px-4 py-3 text-n-2">{f.type || '—'}</td>
                            <td className="px-4 py-3 text-n-2">
                              {typeof f.quantity === 'number' ? f.quantity : (f.quantity || '—')}
                            </td>
                            <td className="px-4 py-3 text-n-2">{f.unit || '—'}</td>
                            <td className="px-4 py-3 text-n-2">{f.application_time || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Organic alternatives */}
              {Array.isArray(resp.organic_alternatives) && resp.organic_alternatives.length > 0 && (
                <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-color-4/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-color-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h2 className="h5 text-n-1">Organic Alternatives</h2>
                  </div>
                  <ul className="space-y-3">
                    {resp.organic_alternatives.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-color-4 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-n-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Irrigation advice */}
              {resp.irrigation_advice && (
                <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-color-5/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-color-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h2 className="h5 text-n-1">Irrigation Advice</h2>
                  </div>
                  <p className="text-n-2 whitespace-pre-line leading-relaxed">{resp.irrigation_advice}</p>
                </div>
              )}

              {/* Soil health tips */}
              {Array.isArray(resp.soil_health_tips) && resp.soil_health_tips.length > 0 && (
                <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-color-6/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-color-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="h5 text-n-1">Soil Health Tips</h2>
                  </div>
                  <ul className="space-y-3">
                    {resp.soil_health_tips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-color-6 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-n-2">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Caution */}
              {Array.isArray(resp.caution) && resp.caution.length > 0 && (
                <div className="bg-n-6/50 backdrop-blur-xl border border-color-3/30 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-color-3/20 rounded-xl flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-color-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h2 className="h5 text-color-3">⚠️ Caution</h2>
                  </div>
                  <ul className="space-y-3">
                    {resp.caution.map((c, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-color-3 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-color-3">{c}</span>
                      </li>
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
                  <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-n-7/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-n-3">No advisory data available in the response.</p>
                  </div>
                )}
          </section>
        )}
        </div>
      </div>
    </div>
  );
}
