import React from 'react';

// Define the props for the ErrorDisplay component
interface ErrorDisplayProps {
  messages: string[] | string
}

// ErrorDisplay component
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ messages }) => {
    return (
      <div className="error-display bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        {Array.isArray(messages) ? (
          <ul className="mt-1">
            {messages.map((message, index) => (
              <li key={index} className="text-sm">{message}</li>
            ))}
          </ul>
        ) : (
          <p>{messages}</p>
        )}
      </div>
    );
  };

export default ErrorDisplay;