import React, { useState } from 'react';
import { ICONS } from '../constants';

const SizzuAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleModal}
                title="Open Sizzu Assistant"
                className="fixed bottom-6 right-6 w-16 h-16 bg-teal-500 text-white rounded-full shadow-lg flex items-center justify-center z-40 animate-pulse-glow hover:animate-none transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                {ICONS.SIZZU}
            </button>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in"
                    onClick={toggleModal}
                >
                    <div className="relative w-48 h-48">
                        <div className="absolute inset-0 bg-teal-400/30 rounded-full animate-ping"></div>
                        <div className="relative w-full h-full bg-teal-500/80 rounded-full flex items-center justify-center text-white">
                           {ICONS.SIZZU}
                        </div>
                    </div>
                     <p className="absolute bottom-16 text-white/70 text-lg">"Hey Sizzu..."</p>
                </div>
            )}
        </>
    );
};

export default SizzuAssistant;