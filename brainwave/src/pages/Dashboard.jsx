// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  timeout: 30000,
});

export default function Dashboard() {
  const [locality, setLocality] = useState('');
  const [cropType, setCropType] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [soilType, setSoilType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);

  const isComplete =
    locality.trim() &&
    cropType.trim() &&
    growthStage.trim() &&
    soilType.trim();

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
          message: message.trim() || '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.data) throw new Error('No data received');

      // ✅ Flexible response handling
      const advisory = res.data.data || res.data;
      setResp(advisory);

      toast.success('Advisory generated successfully');
    } catch (err) {
      console.error('API Error:', err);
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout - try again');
      } else if (err.response) {
        toast.error(err.response.data?.message || `Error: ${err.response.status}`);
      } else if (err.request) {
        toast.error('No response from server - check connection');
      } else {
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
    toast.success('Form cleared');
  };

  return (
    <div className="relative min-h-screen bg-n-8 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="h2 text-n-1">Soil Advisory</h1>
            {(resp || locality || cropType || growthStage || soilType || message) && (
              <button
                onClick={clearForm}
                className="px-4 py-2 text-sm text-n-3 hover:text-n-1 hover:bg-n-7/30 rounded-2xl transition-all"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6 bg-n-6/50 p-8 rounded-3xl">
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="Locality (e.g., Pune, Maharashtra)"
              disabled={loading}
              required
              className="w-full p-3 rounded-2xl"
            />
            <input
              type="text"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="Crop Type (e.g., Wheat)"
              disabled={loading}
              required
              className="w-full p-3 rounded-2xl"
            />
            <input
              type="text"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              placeholder="Growth Stage (e.g., Vegetative)"
              disabled={loading}
              required
              className="w-full p-3 rounded-2xl"
            />
            <input
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              placeholder="Soil Type (e.g., Loamy)"
              disabled={loading}
              required
              className="w-full p-3 rounded-2xl"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional message (weather, concerns...)"
              maxLength={1000}
              disabled={loading}
              className="w-full p-3 rounded-2xl"
            />
            <button
              type="submit"
              disabled={!isComplete || loading}
              className="w-full py-3 bg-gradient-to-r from-color-1 to-color-2 text-white rounded-2xl"
            >
              {loading ? 'Analyzing...' : 'Get Advisory'}
            </button>
          </form>

          {/* Response Display */}
          {resp && (
            <div className="mt-8 space-y-6">
              {resp.overview && (
                <div className="p-6 bg-n-6/50 rounded-2xl">
                  <h2 className="text-lg font-bold mb-2">Overview</h2>
                  <p>{resp.overview}</p>
                </div>
              )}

              {Array.isArray(resp.fertilizer_recommendations) &&
                resp.fertilizer_recommendations.length > 0 && (
                  <div className="p-6 bg-n-6/50 rounded-2xl">
                    <h2 className="text-lg font-bold mb-2">Fertilizer Recommendations</h2>
                    <ul>
                      {resp.fertilizer_recommendations.map((f, i) => (
                        <li key={i}>
                          {f.type} - {f.quantity} {f.unit} ({f.application_time})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {Array.isArray(resp.organic_alternatives) &&
                resp.organic_alternatives.length > 0 && (
                  <div className="p-6 bg-n-6/50 rounded-2xl">
                    <h2 className="text-lg font-bold mb-2">Organic Alternatives</h2>
                    <ul>
                      {resp.organic_alternatives.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {resp.irrigation_advice && (
                <div className="p-6 bg-n-6/50 rounded-2xl">
                  <h2 className="text-lg font-bold mb-2">Irrigation Advice</h2>
                  <p>{resp.irrigation_advice}</p>
                </div>
              )}

              {Array.isArray(resp.soil_health_tips) && resp.soil_health_tips.length > 0 && (
                <div className="p-6 bg-n-6/50 rounded-2xl">
                  <h2 className="text-lg font-bold mb-2">Soil Health Tips</h2>
                  <ul>
                    {resp.soil_health_tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(resp.caution) && resp.caution.length > 0 && (
                <div className="p-6 bg-n-6/50 rounded-2xl border border-red-400">
                  <h2 className="text-lg font-bold mb-2 text-red-500">⚠️ Caution</h2>
                  <ul>
                    {resp.caution.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
              <audio src='http://localhost:3000/output.mp3' autoPlay={true}></audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
