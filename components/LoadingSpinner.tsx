
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  }[size];

  return (
    <div className={`
      ${sizeClasses}
      rounded-full
      border-slate-200
      border-t-teal-500
      animate-spin
      ${className}
    `}></div>
  );
};

export default LoadingSpinner;
