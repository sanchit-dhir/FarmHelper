import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/user',
  withCredentials: false // set true only if using cookies on server
});

const Register = () => {
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      toast.error('All fields are required!');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/register', { email, username, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success(res.data?.message || 'OTP sent to email');
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/verify-otp', { email, otp }, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Registration complete');
      const token = res.data?.token;
      if (token) localStorage.setItem('token', token);
      // window.location.href = '/dashboard';
    } catch (err) {
      const msg = err?.response?.data?.message || 'OTP verification failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <form
        onSubmit={step === 1 ? sendOtp : verifyOtp}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? 'Create account' : 'Verify OTP'}
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              minLength={6}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">Login</a>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Enter the 6‑digit code sent to {email}
            </p>

            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full p-3 mb-6 border rounded tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded font-semibold hover:bg-gray-300 transition"
              disabled={loading}
            >
              Back
            </button>

            <p className="text-center text-sm mt-4">
              Mistyped email?{' '}
              <span
                onClick={() => setStep(1)}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Edit details
              </span>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default Register;
