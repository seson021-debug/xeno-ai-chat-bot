import React from 'react';
import type { Message } from '../types';
import { Author } from '../types';
import LoadingSpinner from './LoadingSpinner';


interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLoading = false }) => {
  const isUser = message.author === Author.USER;

  const bubbleClasses = isUser
    ? 'bg-teal-500 text-white rounded-br-none'
    : 'bg-slate-100 text-slate-800 rounded-bl-none';

  const containerClasses = isUser ? 'items-end' : 'items-start';
  const authorAvatar = isUser ? '👤' : '🤖';

  return (
    <div className={`flex flex-col gap-1 w-full max-w-xl mx-auto ${containerClasses} animate-fade-in`}>
       <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl shrink-0 ${isUser ? 'bg-teal-100' : 'bg-slate-200'}`}>
          {authorAvatar}
        </div>
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${bubbleClasses}`}>
          {isLoading ? (
            <div className="flex items-center justify-center p-1">
              <LoadingSpinner size="sm"/>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}
        </div>
      </div>
       <span className={`text-xs text-slate-400 ${isUser ? 'pr-11' : 'pl-11'}`}>{message.timestamp}</span>
    </div>
  );
};

export default MessageBubble;