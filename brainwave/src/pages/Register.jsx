import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import nameAudio from '../assets/name.mp3';
import emailAudio from '../assets/email.mp3';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEmailPlaying, setIsEmailPlaying] = useState(false);
  const audioRef = useRef(null);
  const emailAudioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playEmailAudio = () => {
    if (emailAudioRef.current) {
      emailAudioRef.current.play();
      setIsEmailPlaying(true);
    }
  };

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
    <div className="relative min-h-screen bg-n-8 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      {/* Audio Elements */}
      <audio
        ref={audioRef}
        src={nameAudio}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <audio
        ref={emailAudioRef}
        src={emailAudio}
        onEnded={() => setIsEmailPlaying(false)}
        onPause={() => setIsEmailPlaying(false)}
        onPlay={() => setIsEmailPlaying(true)}
      />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-n-8 via-n-7 to-n-6">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-color-1/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-color-2/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-color-3/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-color-1 to-color-2 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="h2 text-n-1 mb-2">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="body-2 text-n-3">
              {step === 1 ? 'Join FarmHelper and start your journey' : 'Enter the verification code'}
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-n-6/50 backdrop-blur-xl border border-n-5/20 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={step === 1 ? sendOtp : verifyOtp} className="space-y-6">
              {step === 1 && (
                <>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-n-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={playEmailAudio}
                        disabled={isEmailPlaying}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-color-1 hover:text-color-2 transition-colors disabled:opacity-50 z-10"
                      >
                          {isEmailPlaying ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-n-2">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                        required
                      />
                      {username && (
                        <button
                          type="button"
                          onClick={playAudio}
                          disabled={isPlaying}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-color-1 hover:text-color-2 transition-colors disabled:opacity-50"
                        >
                          {isPlaying ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-n-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-n-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5 text-n-4 hover:text-n-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-n-4 hover:text-n-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Send OTP Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-color-1 to-color-2 text-white font-semibold rounded-2xl hover:from-color-1/90 hover:to-color-2/90 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:ring-offset-2 focus:ring-offset-n-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </div>
                    ) : (
                      "Send Verification Code"
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-n-3 text-sm">
                      Already have an account?{" "}
                      <Link to="/login" className="text-color-1 hover:text-color-2 font-medium transition-colors">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  {/* OTP Instructions */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-color-1/20 rounded-2xl mb-4">
                      <svg className="w-8 h-8 text-color-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-n-2 text-sm mb-2">
                      We've sent a 6-digit code to
                    </p>
                    <p className="text-n-1 font-medium">{email}</p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-n-2">Verification Code</label>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full py-4 px-6 bg-n-7/50 border border-n-5/30 rounded-2xl text-n-1 placeholder-n-4 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:border-color-1/50 transition-all duration-200 text-center text-2xl tracking-widest font-mono"
                      required
                    />
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-color-1 to-color-2 text-white font-semibold rounded-2xl hover:from-color-1/90 hover:to-color-2/90 focus:outline-none focus:ring-2 focus:ring-color-1/50 focus:ring-offset-2 focus:ring-offset-n-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Create Account"
                    )}
                  </button>

                  {/* Back Button */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 px-6 bg-n-7/30 border border-n-5/30 text-n-2 font-medium rounded-2xl hover:bg-n-7/50 hover:text-n-1 transition-all duration-200"
                    disabled={loading}
                  >
                    Back to Details
                  </button>

                  {/* Edit Email Link */}
                  <div className="text-center">
                    <p className="text-n-3 text-sm">
                      Wrong email?{" "}
                      <button
                        onClick={() => setStep(1)}
                        className="text-color-1 hover:text-color-2 font-medium transition-colors"
                      >
                        Edit details
                      </button>
                    </p>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center text-n-4 hover:text-n-2 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
