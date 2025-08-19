import React, { useState } from 'react';
import { APP_NAME, ICONS } from '../constants';

interface OnboardingModalProps {
    onComplete: (username: string) => Promise<void>;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim() && !isLoading) {
            setIsLoading(true);
            await onComplete(username.trim());
            // The app will navigate away on success.
            setIsLoading(false); // In case of error
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <div className="flex justify-center items-center gap-3 mb-4">
                    {ICONS.LOGO}
                    <h1 className="text-3xl font-bold text-slate-800">{APP_NAME}</h1>
                </div>
                <h2 className="text-xl font-medium text-slate-600 mb-2">Welcome!</h2>
                <p className="text-slate-500 mb-8">Let's get you set up. What should we call you?</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full px-4 py-3 bg-slate-100 rounded-lg border-2 border-transparent focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!username.trim() || isLoading}
                        className="w-full mt-6 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isLoading ? 'Saving...' : 'Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingModal;
