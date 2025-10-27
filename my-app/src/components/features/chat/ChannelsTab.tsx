import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  unreadCount?: number;
  lastActivity?: string;
  icon?: string;
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'general',
    description: 'generalDesc',
    memberCount: 1250,
    unreadCount: 5,
    lastActivity: '10m',
    icon: '📢',
  },
  {
    id: '2',
    name: 'development',
    description: 'developmentDesc',
    memberCount: 45,
    unreadCount: 12,
    lastActivity: '30m',
    icon: '💻',
  },
  {
    id: '3',
    name: 'marketing',
    description: 'marketingDesc',
    memberCount: 28,
    lastActivity: '2h',
    icon: '📈',
  },
  {
    id: '4',
    name: 'design',
    description: 'designDesc',
    memberCount: 15,
    unreadCount: 3,
    lastActivity: '1h',
    icon: '🎨',
  },
  {
    id: '5',
    name: 'random',
    description: 'randomDesc',
    memberCount: 89,
    lastActivity: '5m',
    icon: '🎲',
  },
];

const ChannelsTab = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [channels] = useState<Channel[]>(mockChannels);

  const filteredChannels = channels.filter((channel) =>
    t(`channels.${channel.name}`).toLowerCase().includes(searchQuery.toLowerCase()) ||
    t(`channels.${channel.description}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 bg-[#f8f8f8] border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-white shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-2">{t('channels.title')}</h2>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('channels.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1164a3] focus:border-[#1164a3] text-sm"
          />
          <svg
            className="absolute left-2.5 top-2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-300 bg-white">
        <button className="flex-1 py-2 text-xs font-semibold text-[#1164a3] border-b-2 border-[#1164a3]">
          {t('channels.all')}
        </button>
        <button className="flex-1 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900">
          {t('channels.joined')}
        </button>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChannels.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-xs">{t('channels.noChannels')}</p>
          </div>
        ) : (
          filteredChannels.map((channel) => (
            <button
              key={channel.id}
              className="w-full px-3 py-2 flex items-start space-x-2 hover:bg-white transition-colors text-left border-l-2 border-transparent hover:border-[#1164a3]"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center text-lg">
                  {channel.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">
                    {t(`channels.${channel.name}`)}
                  </h3>
                  {channel.unreadCount && channel.unreadCount > 0 && (
                    <span className="ml-1 flex-shrink-0 min-w-[18px] h-[18px] bg-[#e01e5a] text-white text-[10px] rounded-full flex items-center justify-center px-1 font-semibold">
                      {channel.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate mb-0.5">
                  {t(`channels.${channel.description}`)}
                </p>
                <div className="flex items-center text-[11px] text-gray-500 space-x-1.5">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {channel.memberCount}
                  </span>
                  <span>•</span>
                  <span>{channel.lastActivity}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Create Channel Button */}
      <div className="p-3 border-t border-gray-300 bg-white">
        <button className="w-full bg-[#007a5a] hover:bg-[#006647] text-white py-2 rounded text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('channels.createChannel')}</span>
        </button>
      </div>
    </div>
  );
};

export default ChannelsTab;
