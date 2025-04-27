'use client';

import React from 'react';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    contexts?: string[];
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [showContexts, setShowContexts] = React.useState(false);

  const hasContexts = !isUser && message.contexts && message.contexts.length > 0;

  const toggleContexts = () => {
    if (hasContexts) {
      setShowContexts(!showContexts);
    }
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {hasContexts && (
          <div
            className="mt-2 text-xs cursor-pointer flex items-center"
            onClick={toggleContexts}
          >
            <span className="underline">
              {showContexts ? 'Hide sources' : 'Show sources'}
            </span>
            <svg
              className={`ml-1 h-3 w-3 transform transition-transform ${showContexts ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {hasContexts && showContexts && (
        <div className="max-w-[80%] mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded-lg">
          <div className="font-semibold mb-1">Sources:</div>
          {message.contexts.map((context, index) => (
            <div key={index} className="mb-2 p-2 border-l-2 border-gray-300 pl-2">
              <div className="whitespace-pre-wrap">{context}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
