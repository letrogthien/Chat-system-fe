import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  memberCount?: number;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  };
  isOnline?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data giống response từ API
const mockChannels: Channel[] = [
  {
    id: 'ch_001',
    name: 'general',
    description: 'General discussion for all team members',
    type: 'public',
    memberCount: 1250,
    unreadCount: 5,
    lastMessage: {
      content: 'Welcome to the general channel!',
      senderId: 'user_123',
      senderName: 'John Doe',
      timestamp: '2024-10-27T14:30:00Z',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-27T14:30:00Z',
  },
  {
    id: 'ch_002',
    name: 'development',
    description: 'Development team discussions',
    type: 'private',
    memberCount: 45,
    unreadCount: 12,
    lastMessage: {
      content: 'New PR is ready for review',
      senderId: 'user_456',
      senderName: 'Jane Smith',
      timestamp: '2024-10-27T14:00:00Z',
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-10-27T14:00:00Z',
  },
  {
    id: 'ch_003',
    name: 'marketing',
    description: 'Marketing campaigns and strategies',
    type: 'public',
    memberCount: 28,
    lastMessage: {
      content: 'Q4 campaign planning meeting tomorrow',
      senderId: 'user_789',
      senderName: 'Mike Johnson',
      timestamp: '2024-10-27T12:00:00Z',
    },
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-10-27T12:00:00Z',
  },
  {
    id: 'ch_004',
    name: 'design',
    description: 'UI/UX design discussions',
    type: 'private',
    memberCount: 15,
    unreadCount: 3,
    lastMessage: {
      content: 'New design system v2.0 is ready',
      senderId: 'user_321',
      senderName: 'Sarah Lee',
      timestamp: '2024-10-27T13:00:00Z',
    },
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-10-27T13:00:00Z',
  },
  {
    id: 'ch_005',
    name: 'random',
    description: 'Random chats and fun stuff',
    type: 'public',
    memberCount: 89,
    lastMessage: {
      content: 'Happy Friday everyone! �',
      senderId: 'user_654',
      senderName: 'Tom Wilson',
      timestamp: '2024-10-27T14:45:00Z',
    },
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-10-27T14:45:00Z',
  },
  {
    id: 'dm_001',
    name: 'Alice Cooper',
    type: 'direct',
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=1',
    unreadCount: 2,
    lastMessage: {
      content: 'Hey, can we discuss the project?',
      senderId: 'user_alice',
      senderName: 'Alice Cooper',
      timestamp: '2024-10-27T14:20:00Z',
    },
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-10-27T14:20:00Z',
  },
  {
    id: 'dm_002',
    name: 'Bob Martin',
    type: 'direct',
    isOnline: false,
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: {
      content: 'Thanks for the update!',
      senderId: 'user_bob',
      senderName: 'Bob Martin',
      timestamp: '2024-10-27T10:00:00Z',
    },
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-10-27T10:00:00Z',
  },
  {
    id: 'dm_003',
    name: 'Carol White',
    type: 'direct',
    isOnline: true,
    avatar: 'https://i.pravatar.cc/150?img=3',
    unreadCount: 1,
    lastMessage: {
      content: 'See you in the meeting',
      senderId: 'user_carol',
      senderName: 'Carol White',
      timestamp: '2024-10-27T13:30:00Z',
    },
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-10-27T13:30:00Z',
  },
];

const ChannelsTab = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ channel: Channel; x: number; y: number } | null>(null);
  const [starredChannels, setStarredChannels] = useState<Set<string>>(new Set());
  const [mutedChannels, setMutedChannels] = useState<Set<string>>(new Set());

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && channel.type !== 'direct'; // Only show channels, not DMs
  });

  // Sort: starred first, then by unread, then by name
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    const aStarred = starredChannels.has(a.id);
    const bStarred = starredChannels.has(b.id);
    if (aStarred !== bStarred) return aStarred ? -1 : 1;
    
    const aUnread = a.unreadCount || 0;
    const bUnread = b.unreadCount || 0;
    if (aUnread !== bUnread) return bUnread - aUnread;
    
    return a.name.localeCompare(b.name);
  });

  // Helper function to format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // Handlers
  const handleContextMenu = (e: React.MouseEvent, channel: Channel) => {
    e.preventDefault();
    setContextMenu({ channel, x: e.clientX, y: e.clientY });
  };

  const handleToggleStar = (channelId: string) => {
    setStarredChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) {
        newSet.delete(channelId);
      } else {
        newSet.add(channelId);
      }
      return newSet;
    });
    setContextMenu(null);
  };

  const handleToggleMute = (channelId: string) => {
    setMutedChannels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(channelId)) {
        newSet.delete(channelId);
      } else {
        newSet.add(channelId);
      }
      return newSet;
    });
    setContextMenu(null);
  };

  const handleMarkAsRead = (channelId: string) => {
    setChannels(prev => prev.map(ch =>
      ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
    ));
    setContextMenu(null);
  };

  const handleLeaveChannel = (channelId: string) => {
    if (confirm('Are you sure you want to leave this channel?')) {
      setChannels(prev => prev.filter(ch => ch.id !== channelId));
      setContextMenu(null);
    }
  };

  const handleCopyLink = (channelId: string) => {
    const link = `${globalThis.location.origin}/channel/${channelId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
    setContextMenu(null);
  };

  // Get icon based on channel type
  const getChannelIcon = (channel: Channel) => {
    if (channel.type === 'direct') {
      return channel.avatar ? (
        <img src={channel.avatar} alt={channel.name} className="w-7 h-7 rounded-full" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#1164a3] flex items-center justify-center text-white text-xs font-semibold">
          {channel.name.charAt(0).toUpperCase()}
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center">
        {channel.type === 'private' ? (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        ) : (
          <span className="text-base">#</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-3 py-3 border-b border-gray-300">
        <h2 className="text-base font-bold text-gray-900 mb-2">{t('channels.title')}</h2>
        <div className="relative">
          <input
            type="text"
            placeholder={t('channels.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1164a3]"
          />
          <svg className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto">
        {/* Public/Private Channels */}
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Channels</h3>
          <div className="space-y-0.5">
            {sortedChannels.map((channel) => {
              const isStarred = starredChannels.has(channel.id);
              const isMuted = mutedChannels.has(channel.id);
              
              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  onContextMenu={(e) => handleContextMenu(e, channel)}
                  className={`w-full px-2 py-2 flex items-center space-x-2 rounded transition-colors text-left group relative ${
                    selectedChannel?.id === channel.id
                      ? 'bg-[#1164a3] bg-opacity-10 text-[#1164a3]'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  {getChannelIcon(channel)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {channel.name}
                        </span>
                        {isMuted && (
                          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(channel.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity p-0.5 hover:bg-gray-200 rounded"
                          title={isStarred ? 'Remove star' : 'Add star'}
                        >
                          <svg className={`w-3.5 h-3.5 ${isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} fill={isStarred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                      {channel.lastMessage && (
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {formatTime(channel.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {channel.lastMessage && (
                      <p className="text-xs text-gray-500 truncate">
                        {channel.lastMessage.content}
                      </p>
                    )}
                  </div>
                  {!isMuted && channel.unreadCount && channel.unreadCount > 0 && (
                    <span className="min-w-[18px] h-[18px] bg-[#e01e5a] text-white text-[10px] rounded-full flex items-center justify-center px-1 font-semibold flex-shrink-0">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Add Channel Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full px-2 py-2 mt-2 flex items-center space-x-2 rounded hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium">Add channels</span>
          </button>
        </div>

        {/* Direct Messages are handled in Chats - removed from Channels list */}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <button 
            className="fixed inset-0 z-40 w-full h-full bg-transparent border-0 cursor-default" 
            onClick={() => setContextMenu(null)}
            onKeyDown={(e) => e.key === 'Escape' && setContextMenu(null)}
            aria-label="Close context menu"
          />
          <div
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => handleToggleStar(contextMenu.channel.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill={starredChannels.has(contextMenu.channel.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {starredChannels.has(contextMenu.channel.id) ? 'Remove star' : 'Star channel'}
            </button>
            <button
              onClick={() => handleToggleMute(contextMenu.channel.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {mutedChannels.has(contextMenu.channel.id) ? (
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                )}
              </svg>
              {mutedChannels.has(contextMenu.channel.id) ? 'Unmute channel' : 'Mute channel'}
            </button>
            {contextMenu.channel.unreadCount && contextMenu.channel.unreadCount > 0 && (
              <button
                onClick={() => handleMarkAsRead(contextMenu.channel.id)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as read
              </button>
            )}
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => handleCopyLink(contextMenu.channel.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy link
            </button>
            <button
              onClick={() => alert('Channel settings - Coming soon!')}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Channel settings
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => handleLeaveChannel(contextMenu.channel.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Leave channel
            </button>
          </div>
        </>
      )}

      {/* Create Channel Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Create a channel</h2>
            <p className="text-sm text-gray-600 mb-4">
              Channels are where your team communicates. They're best when organized around a topic — #marketing, for example.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="channel-name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  id="channel-name"
                  type="text"
                  placeholder="e.g. marketing"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1164a3]"
                />
              </div>
              <div>
                <label htmlFor="channel-description" className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  id="channel-description"
                  placeholder="What's this channel about?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1164a3]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Make private</span>
                </label>
                <p className="text-xs text-gray-500 ml-6 mt-1">
                  When a channel is set to private, it can only be viewed or joined by invitation
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Create channel - Coming soon!');
                  setShowCreateModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1164a3] hover:bg-[#0d4f8a] rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsTab;
