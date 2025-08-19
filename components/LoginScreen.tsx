import React, { useState, useEffect } from 'react';
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { ICONS, APP_NAME } from '../constants';
import { signInWithGoogle, setupRecaptcha, sendOtp, verifyOtp } from '../services/firebaseService';
import LoadingSpinner from './LoadingSpinner';

type View = 'options' | 'phone-input' | 'otp-input';

const LoginScreen: React.FC = () => {
  const [view, setView] = useState<View>('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This is to ensure the recaptcha is only set up once.
    if (view === 'phone-input' && !(window as any).recaptchaVerifier) {
      try {
        setupRecaptcha('recaptcha-container');
      } catch (e) {
        setError("Failed to initialize verification. Please refresh.");
      }
    }
  }, [view]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // onAuthStateChanged in App.tsx will handle navigation
    } catch (e: any) {
      setError(e.message || "Failed to sign in with Google.");
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await sendOtp(phoneNumber, appVerifier);
      setConfirmationResult(result);
      setView('otp-input');
    } catch (e: any) {
      setError(e.message || "Failed to send OTP. Check the phone number.");
      // Reset recaptcha
      (window as any).recaptchaVerifier.render().then((widgetId: any) => {
         (window as any).grecaptcha.reset(widgetId);
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setIsLoading(true);
    setError(null);
    try {
      await verifyOtp(confirmationResult, otp);
      // onAuthStateChanged in App.tsx will handle navigation
    } catch (e: any) {
        setError(e.message || "Invalid OTP. Please try again.");
        setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'phone-input':
        return (
          <form onSubmit={handlePhoneSignIn} className="w-full max-w-sm space-y-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+1 555-555-5555"
              className="w-full px-4 py-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              required
            />
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-all disabled:bg-slate-300">
              {isLoading ? <LoadingSpinner size="sm" /> : 'Send Code'}
            </button>
            <button onClick={() => setView('options')} className="text-sm text-slate-500 hover:text-teal-600">Back to options</button>
          </form>
        );
      case 'otp-input':
         return (
          <form onSubmit={handleOtpVerify} className="w-full max-w-sm space-y-4">
             <p className="text-sm text-slate-500">Enter the code sent to {phoneNumber}</p>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              required
            />
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-all disabled:bg-slate-300">
              {isLoading ? <LoadingSpinner size="sm" /> : 'Verify Code'}
            </button>
            <button onClick={() => setView('phone-input')} className="text-sm text-slate-500 hover:text-teal-600">Change number</button>
          </form>
        );
      case 'options':
      default:
        return (
          <div className="w-full max-w-sm space-y-4 animate-fade-in [animation-delay:400ms]">
            <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105">
              {ICONS.GOOGLE}
              Sign in with Google
            </button>
            <button onClick={() => setView('phone-input')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105">
              {ICONS.PHONE}
              Sign in with Phone
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50">
      <div id="recaptcha-container"></div>
      <div className="text-center p-8">
        <div className="flex justify-center items-center gap-3 mb-6 animate-fade-in">
          {ICONS.LOGO}
          <h1 className="text-5xl font-bold text-slate-800">{APP_NAME}</h1>
        </div>
        <p className="text-slate-500 text-lg mb-12 animate-fade-in [animation-delay:200ms]">
          Where should we begin?
        </p>
        {isLoading && view === 'options' ? <LoadingSpinner /> : renderContent()}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LoginScreen;