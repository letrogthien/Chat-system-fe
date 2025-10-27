import { Link } from 'react-router-dom';

export type Tab = 'chats' | 'channels' | 'contacts' | 'settings';

interface ChatSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const ChatSidebar = ({ activeTab, onTabChange }: ChatSidebarProps) => {

  const tabs = [
    {
      id: 'chats' as Tab,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      label: 'Chats',
    },
    {
      id: 'channels' as Tab,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Channels',
    },
    {
      id: 'contacts' as Tab,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Contacts',
    },
    {
      id: 'settings' as Tab,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Settings',
    },
  ];

  return (
    <div className="w-16 bg-[#3f0e40] flex flex-col items-center py-3 space-y-1 relative z-40">
      {/* Workspace Logo */}
      <Link to="/" className="mb-2">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#3f0e40] font-bold text-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
          C
        </div>
      </Link>

      <div className="w-8 border-t border-white/20 my-1"></div>

      {/* Tabs */}
      <div className="flex-1 flex flex-col space-y-1 w-full px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              w-12 h-12 rounded-lg flex items-center justify-center transition-all relative group mx-auto
              ${activeTab === tab.id 
                ? 'bg-[#1164a3] text-white' 
                : 'text-white/70 hover:bg-[#350d36] hover:text-white'
              }
            `}
            title={tab.label}
          >
            {tab.icon}
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
              {tab.label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black"></div>
            </div>
          </button>
        ))}
      </div>

      <div className="w-8 border-t border-white/20 my-1"></div>

      {/* User Avatar */}
      <div className="relative group">
        <button className="w-10 h-10 rounded-lg overflow-hidden hover:opacity-80 transition-all">
          <img 
            src="https://ui-avatars.com/api/?name=User&background=1164a3&color=fff" 
            alt="User"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Online Status */}
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#3f0e40]"></div>

        {/* User Menu Tooltip */}
        <div className="absolute left-full ml-3 bottom-0 px-3 py-1.5 bg-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
          Profile
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black"></div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
