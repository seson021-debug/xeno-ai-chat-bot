import React, { useState, useEffect, useRef, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ErrorDisplay from './ErrorDisplay';
import { streamChatResponse } from '../services/geminiService';
import type { ChatSession, Message } from '../types';
import { Author } from '../types';
import { ICONS } from '../constants';

interface ChatWindowProps {
  chatSession: ChatSession;
  onUpdateSession: (session: ChatSession) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatSession, onUpdateSession }) => {
  const [messages, setMessages] = useState<Message[]>(chatSession.messages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text,
      author: Author.USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    // Add a placeholder for the bot's response
    const botMessageId = `msg-${Date.now() + 1}`;
    const botMessagePlaceholder: Message = {
        id: botMessageId,
        text: '',
        author: Author.BOT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, botMessagePlaceholder]);
    
    let fullBotResponse = '';
    let finalMessages: Message[] = [];

    try {
      const responseStream = await streamChatResponse(messages, text);
      for await (const chunk of responseStream) {
        fullBotResponse += chunk.text;
        setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: fullBotResponse } : m));
      }
      
      finalMessages = newMessages.concat({
        id: botMessageId,
        text: fullBotResponse,
        author: Author.BOT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      // Remove placeholder on error
      finalMessages = newMessages;
       setMessages(newMessages);
    } finally {
        const isFirstUserMessage = messages.filter(m => m.author === Author.USER).length === 0;
        const newTitle = isFirstUserMessage && text.length > 5 ? text.substring(0, 40) + '...' : chatSession.title;
        
        const updatedSession: ChatSession = {
            ...chatSession,
            messages: finalMessages,
            title: newTitle
        };
        onUpdateSession(updatedSession);
        setIsLoading(false);
    }
  }, [isLoading, messages, chatSession, onUpdateSession]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-slate-800 truncate pr-4">{chatSession.title}</h2>
        <button className="p-2 text-slate-500 rounded-md hover:bg-slate-100 disabled:text-slate-300" disabled>
          {ICONS.HOME}
        </button>
      </header>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length-1].author === Author.BOT && (
             <MessageBubble message={{
                 id: 'thinking',
                 text: '',
                 author: Author.BOT,
                 timestamp: ''
             }} isLoading={true} />
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white">
        {error && <div className="mb-2"><ErrorDisplay message={error} onRetry={() => setError(null)} /></div>}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatWindow;