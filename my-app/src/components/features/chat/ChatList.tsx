import type { Contact } from '@/pages/ChatPage';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatListProps {
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

type FilterTab = 'all' | 'unread' | 'groups';

// Mock data - Direct messages
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
    status: 'online',
    lastMessage: 'Hey! How are you doing?',
    lastMessageTime: '2 phút',
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=F97316&color=fff',
    status: 'online',
    lastMessage: 'Can we schedule a meeting?',
    lastMessageTime: '15 phút',
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=10B981&color=fff',
    status: 'away',
    lastMessage: 'Thanks for your help!',
    lastMessageTime: '1 giờ',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=8B5CF6&color=fff',
    status: 'offline',
    lastMessage: 'See you tomorrow',
    lastMessageTime: 'Hôm qua',
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+E&background=EC4899&color=fff',
    status: 'busy',
    lastMessage: 'I am in a meeting now',
    lastMessageTime: '2 giờ',
  },
];

// Mock data - Group chats
const mockGroups: Contact[] = [
  {
    id: 'g1',
    name: 'Development Team',
    avatar: 'https://ui-avatars.com/api/?name=Dev+Team&background=0D8ABC&color=fff',
    status: 'online',
    lastMessage: 'Alice: The new feature is ready for review',
    lastMessageTime: '5 phút',
    unreadCount: 12,
    isGroup: true,
    memberCount: 8,
  },
  {
    id: 'g2',
    name: 'Project Alpha',
    avatar: 'https://ui-avatars.com/api/?name=Project+Alpha&background=F97316&color=fff',
    status: 'online',
    lastMessage: 'Bob: Meeting at 3 PM today',
    lastMessageTime: '30 phút',
    unreadCount: 5,
    isGroup: true,
    memberCount: 15,
  },
  {
    id: 'g3',
    name: 'Marketing Team',
    avatar: 'https://ui-avatars.com/api/?name=Marketing&background=10B981&color=fff',
    status: 'online',
    lastMessage: 'Carol: Campaign results are impressive!',
    lastMessageTime: '2 giờ',
    isGroup: true,
    memberCount: 6,
  },
  {
    id: 'g4',
    name: 'Design Discussion',
    avatar: 'https://ui-avatars.com/api/?name=Design&background=8B5CF6&color=fff',
    status: 'away',
    lastMessage: 'David: Check out the new mockups',
    lastMessageTime: '1 ngày',
    unreadCount: 2,
    isGroup: true,
    memberCount: 10,
  },
];

const ChatList = ({ selectedContact, onSelectContact }: ChatListProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [contacts] = useState<Contact[]>(mockContacts);
  const [groups] = useState<Contact[]>(mockGroups);
  const [contextMenuChat, setContextMenuChat] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [mutedChats, setMutedChats] = useState<string[]>([]);
  const [archivedChats, setArchivedChats] = useState<string[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Combine contacts and groups based on filter
  const allChats = [...contacts, ...groups];
  
  const getFilteredChats = () => {
    let chats: Contact[] = [];
    
    switch (activeFilter) {
      case 'all':
        chats = allChats;
        break;
      case 'unread':
        chats = allChats.filter(chat => chat.unreadCount && chat.unreadCount > 0);
        break;
      case 'groups':
        chats = groups;
        break;
      default:
        chats = allChats;
    }
    
    // Apply search filter
    if (searchQuery) {
      chats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return chats;
  };

  const filteredChats = getFilteredChats();

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuChat(null);
      }
    };

    if (contextMenuChat) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenuChat]);

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuChat(chatId);
  };

  const handlePinChat = (chatId: string) => {
    setPinnedChats(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
    setContextMenuChat(null);
  };

  const handleMuteChat = (chatId: string) => {
    setMutedChats(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
    setContextMenuChat(null);
  };

  const handleArchiveChat = (chatId: string) => {
    setArchivedChats(prev => [...prev, chatId]);
    setContextMenuChat(null);
  };

  const handleMarkAsRead = (chatId: string) => {
    // TODO: Implement mark as read logic
    console.log('Mark as read:', chatId);
    setContextMenuChat(null);
  };

  const handleMarkAsUnread = (chatId: string) => {
    // TODO: Implement mark as unread logic
    console.log('Mark as unread:', chatId);
    setContextMenuChat(null);
  };

  const handleDeleteChat = (chatId: string) => {
    if (confirm(t('chat.contextMenu.confirmDelete') || 'Delete this conversation?')) {
      // TODO: Implement delete logic
      console.log('Delete chat:', chatId);
    }
    setContextMenuChat(null);
  };

  // Sort chats: pinned first
  const sortedChats = [...filteredChats].sort((a, b) => {
    const aIsPinned = pinnedChats.includes(a.id);
    const bIsPinned = pinnedChats.includes(b.id);
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  // Filter out archived chats
  const visibleChats = sortedChats.filter(chat => !archivedChats.includes(chat.id));

  return (
    <div className="w-64 bg-[#f8f8f8] border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-300 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">{t('common.messages') || 'Messages'}</h2>
          <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1164a3] focus:border-transparent text-sm placeholder-gray-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
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
      <div className="flex bg-white border-b border-gray-300 text-xs">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 font-semibold transition-colors ${
            activeFilter === 'all'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('chat.filters.all') || 'All'}
        </button>
        <button 
          onClick={() => setActiveFilter('unread')}
          className={`flex-1 py-2 font-semibold transition-colors relative ${
            activeFilter === 'unread'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('chat.filters.unread') || 'Unread'}
          {allChats.some(c => c.unreadCount && c.unreadCount > 0) && (
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-[#e01e5a] rounded-full">
              {allChats.filter(c => c.unreadCount && c.unreadCount > 0).length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveFilter('groups')}
          className={`flex-1 py-2 font-semibold transition-colors ${
            activeFilter === 'groups'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('chat.filters.groups') || 'Groups'}
        </button>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {visibleChats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">{activeFilter === 'unread' ? t('chat.noUnread') || 'No unread messages' : 'No results found'}</p>
          </div>
        ) : (
          visibleChats.map((contact) => {
            const isPinned = pinnedChats.includes(contact.id);
            const isMuted = mutedChats.includes(contact.id);
            
            return (
              <div
                key={contact.id}
                onContextMenu={(e) => handleContextMenu(e, contact.id)}
                className="relative"
              >
                <button
                  onClick={() => onSelectContact(contact)}
                  className={`
                    w-full px-3 py-2 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left relative
                    ${selectedContact?.id === contact.id ? 'bg-[#1164a3]/10 hover:bg-[#1164a3]/10 border-l-2 border-[#1164a3]' : 'border-l-2 border-transparent'}
                  `}
                >
                  {/* Pin Indicator */}
                  {isPinned && (
                    <div className="absolute top-2 left-1 z-10">
                      <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a.75.75 0 01.75.75v6.5h1.5a.75.75 0 010 1.5h-1.5v6.5a.75.75 0 01-1.5 0v-6.5h-1.5a.75.75 0 010-1.5h1.5v-6.5A.75.75 0 0110 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-9 h-9 rounded"
                    />
                    {contact.isGroup ? (
                      // Group indicator
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                    ) : (
                      // Status indicator for direct messages
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          contact.status
                        )}`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {contact.name}
                        </h3>
                        {contact.isGroup && contact.memberCount && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            ({contact.memberCount})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {contact.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 truncate flex-1">
                        {isMuted && (
                          <svg className="w-3 h-3 inline mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                        {contact.isTyping ? (
                          <span className="text-[#1164a3] italic">typing...</span>
                        ) : (
                          contact.lastMessage
                        )}
                      </p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <span className="ml-2 flex-shrink-0 min-w-[18px] h-[18px] px-1 bg-[#e01e5a] text-white text-[11px] font-bold rounded flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Context Menu */}
      {contextMenuChat && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 min-w-[200px]"
          style={{ 
            left: `${contextMenuPosition.x}px`, 
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <button
            onClick={() => handlePinChat(contextMenuChat)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a.75.75 0 01.75.75v6.5h1.5a.75.75 0 010 1.5h-1.5v6.5a.75.75 0 01-1.5 0v-6.5h-1.5a.75.75 0 010-1.5h1.5v-6.5A.75.75 0 0110 2z" />
            </svg>
            <span>
              {pinnedChats.includes(contextMenuChat) 
                ? t('chat.contextMenu.unpin') || 'Unpin' 
                : t('chat.contextMenu.pin') || 'Pin'}
            </span>
          </button>

          <button
            onClick={() => handleMuteChat(contextMenuChat)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              {mutedChats.includes(contextMenuChat) ? (
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
              ) : (
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              )}
            </svg>
            <span>
              {mutedChats.includes(contextMenuChat) 
                ? t('chat.contextMenu.unmute') || 'Unmute' 
                : t('chat.contextMenu.mute') || 'Mute'}
            </span>
          </button>

          <button
            onClick={() => handleMarkAsRead(contextMenuChat)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span>{t('chat.contextMenu.markAsRead') || 'Mark as read'}</span>
          </button>

          <button
            onClick={() => handleMarkAsUnread(contextMenuChat)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
            <span>{t('chat.contextMenu.markAsUnread') || 'Mark as unread'}</span>
          </button>

          <div className="border-t border-gray-200 my-1"></div>

          <button
            onClick={() => handleArchiveChat(contextMenuChat)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>{t('chat.contextMenu.archive') || 'Archive'}</span>
          </button>

          <button
            onClick={() => handleDeleteChat(contextMenuChat)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{t('chat.contextMenu.delete') || 'Delete'}</span>
          </button>
        </div>
      )}

      {/* New Chat Button */}
      <div className="p-3 border-t border-gray-300 bg-white">
        <button className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 rounded-md font-medium text-sm flex items-center justify-center space-x-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New conversation</span>
        </button>
      </div>
    </div>
  );
};

export default ChatList;
