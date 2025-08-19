
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      <p className="text-center font-semibold mb-3">Oops! Something went wrong.</p>
      <p className="text-center text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
