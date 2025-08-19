import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS, APP_NAME } from '../constants';
import type { ChatSession } from '../types';

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onSelectChat,
  onNewChat,
}) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-6 group cursor-pointer">
        <div className="transition-transform duration-300 group-hover:scale-110">
          {ICONS.LOGO}
        </div>
        <h1 className="text-xl font-bold text-slate-800">{APP_NAME}</h1>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 mb-6 text-sm font-medium text-white bg-teal-500 rounded-lg shadow-sm hover:bg-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 hover:shadow-lg hover:shadow-teal-500/30 transform hover:-translate-y-0.5"
      >
        {ICONS.PLUS}
        New Chat
      </button>

      <nav className="flex-1 overflow-y-auto pr-1 -mr-1">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Chats</p>
        <ul className="space-y-1">
          {chatSessions.map(session => (
            <li key={session.id}>
              <button
                onClick={() => onSelectChat(session.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${
                  activeChatId === session.id
                    ? 'bg-teal-100 text-teal-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {session.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg">
              {user?.avatar}
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-2 text-slate-500 rounded-md hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            {ICONS.LOGOUT}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;