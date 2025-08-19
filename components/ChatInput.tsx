import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { isListening, error, startListening, stopListening, hasSupport } = useSpeechRecognition(
    (transcript) => {
      setText(transcript);
    }
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      // Max height for 6 rows of text approx.
      const maxHeight = 150; 
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
      if (isListening) stopListening();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : "Type your message..."}
        className="flex-1 p-3 pr-24 bg-slate-100 rounded-lg resize-none border-2 border-transparent focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300"
        rows={1}
        disabled={isLoading}
      />
      <div className="absolute right-3 bottom-2 flex items-center gap-1">
        {hasSupport && (
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Stop recording' : 'Record speech'}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-200'}`}
              disabled={isLoading}
            >
              {ICONS.MIC}
            </button>
        )}
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2 rounded-full bg-teal-500 text-white disabled:bg-slate-300 hover:bg-teal-600 transition-colors transform hover:scale-110"
        >
          {ICONS.SEND}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs absolute -top-5">{error}</p>}
    </form>
  );
};

export default ChatInput;