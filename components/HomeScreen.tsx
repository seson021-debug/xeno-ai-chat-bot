import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import SizzuAssistant from './SizzuAssistant';
import type { ChatSession } from '../types';
import { Author } from '../types';
import { ICONS } from '../constants';

const EmptyState: React.FC = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-fade-in">
        <div className="text-teal-500/50">
            {ICONS.EMPTY_STATE}
        </div>
        <h2 className="text-xl font-semibold text-slate-600 mt-4">Welcome to Xeno!</h2>
        <p className="mt-1">Create a new conversation to get started.</p>
    </div>
);

const HomeScreen: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const createNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [{
        id: 'msg-1',
        text: 'Welcome to Xeno. How can I help you today?',
        author: Author.BOT,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }],
    };
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, []);

  const updateChatSession = useCallback((updatedSession: ChatSession) => {
    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  }, []);
  
  const activeChat = chatSessions.find(c => c.id === activeChatId);

  return (
    <div className="flex h-screen w-screen bg-white">
      <Sidebar
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={createNewChat}
      />
      <main className="flex-1 flex flex-col h-full bg-white relative">
        {activeChat ? (
          <ChatWindow
            key={activeChat.id} // Re-mount component on chat change
            chatSession={activeChat}
            onUpdateSession={updateChatSession}
          />
        ) : (
          <EmptyState />
        )}
        <SizzuAssistant />
      </main>
    </div>
  );
};

export default HomeScreen;