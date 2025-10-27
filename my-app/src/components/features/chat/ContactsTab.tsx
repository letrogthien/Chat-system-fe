import type { Contact } from '@/pages/ChatPage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ContactsTabProps {
  onSelectContact?: (contact: Contact) => void;
}

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  message?: string;
  timestamp: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
    status: 'online',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=F97316&color=fff',
    status: 'online',
  },
  {
    id: '3',
    name: 'Lê Văn C',
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=10B981&color=fff',
    status: 'away',
  },
  {
    id: '4',
    name: 'Phạm Thị D',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=8B5CF6&color=fff',
    status: 'offline',
  },
  {
    id: '5',
    name: 'Hoàng Văn E',
    avatar: 'https://ui-avatars.com/api/?name=Hoang+Van+E&background=EC4899&color=fff',
    status: 'busy',
  },
  {
    id: '6',
    name: 'Đỗ Thị F',
    avatar: 'https://ui-avatars.com/api/?name=Do+Thi+F&background=3B82F6&color=fff',
    status: 'online',
  },
  {
    id: '7',
    name: 'Vũ Văn G',
    avatar: 'https://ui-avatars.com/api/?name=Vu+Van+G&background=EF4444&color=fff',
    status: 'offline',
  },
  {
    id: '8',
    name: 'Bùi Thị H',
    avatar: 'https://ui-avatars.com/api/?name=Bui+Thi+H&background=14B8A6&color=fff',
    status: 'online',
  },
];

const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req_1',
    name: 'Mai Văn I',
    avatar: 'https://ui-avatars.com/api/?name=Mai+Van+I&background=F59E0B&color=fff',
    message: 'Hi! I would like to connect with you.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'req_2',
    name: 'Trương Thị K',
    avatar: 'https://ui-avatars.com/api/?name=Truong+Thi+K&background=06B6D4&color=fff',
    message: 'Let\'s be friends!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: 'req_3',
    name: 'Phan Văn L',
    avatar: 'https://ui-avatars.com/api/?name=Phan+Van+L&background=A855F7&color=fff',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

const ContactsTab = ({ onSelectContact }: ContactsTabProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(mockFriendRequests);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showRequestsPanel, setShowRequestsPanel] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ contact: Contact; x: number; y: number } | null>(null);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleAcceptRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      // Add to contacts
      const newContact: Contact = {
        id: `contact_${Date.now()}`,
        name: request.name,
        avatar: request.avatar,
        status: 'online',
      };
      setContacts(prev => [...prev, newContact]);
      // Remove from requests
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleDeclineRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRemoveFriend = (contactId: string) => {
    if (confirm(t('contacts.contextMenu.confirmRemove'))) {
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setContextMenu(null);
    }
  };

  const handleBlockContact = (contactId: string) => {
    if (confirm(t('contacts.contextMenu.confirmBlock'))) {
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setContextMenu(null);
      alert(t('contacts.contextMenu.blockSuccess'));
    }
  };

  const handleContextMenu = (e: React.MouseEvent, contact: Contact) => {
    e.preventDefault();
    setContextMenu({ contact, x: e.clientX, y: e.clientY });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return t('contacts.friendRequests.justNow');
    if (hours < 24) return t('contacts.friendRequests.hoursAgo', { count: hours });
    if (days < 7) return t('contacts.friendRequests.daysAgo', { count: days });
    return date.toLocaleDateString();
  };

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

  const getStatusText = (status: Contact['status']) => {
    const statusMap: Record<Contact['status'], string> = {
      'online': t('contacts.status.online'),
      'away': t('contacts.status.away'),
      'busy': t('contacts.status.busy'),
      'offline': t('contacts.status.offline')
    };
    return statusMap[status] || t('contacts.status.offline');
  };

  // Group contacts by status
  const onlineContacts = filteredContacts.filter(c => c.status === 'online');
  const offlineContacts = filteredContacts.filter(c => c.status !== 'online');

  return (
    <div className="w-64 bg-[#f8f8f8] border-r border-gray-300 flex flex-col relative">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-900">{t('contacts.title')}</h2>
          
          {/* Friend Requests Badge */}
          <button
            onClick={() => setShowRequestsPanel(!showRequestsPanel)}
            className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${showRequestsPanel ? 'bg-gray-100' : ''}`}
            title={t('contacts.friendRequests.title')}
          >
            <svg className={`w-5 h-5 ${showRequestsPanel ? 'text-[#007a5a]' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            {friendRequests.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1 animate-pulse shadow-md">
                {friendRequests.length > 9 ? '9+' : friendRequests.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('contacts.searchPlaceholder')}
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

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-xs">{t('contacts.noContactsFound')}</p>
          </div>
        ) : (
          <>
            {/* Online Contacts */}
            {onlineContacts.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-white border-b border-gray-300">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    {t('contacts.activeNow')} — {onlineContacts.length}
                  </h3>
                </div>
                {onlineContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelectContact?.(contact)}
                    onContextMenu={(e) => handleContextMenu(e, contact)}
                    className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-white transition-colors text-left border-l-2 border-transparent hover:border-[#1164a3]"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-9 h-9 rounded"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#f8f8f8] ${getStatusColor(
                          contact.status
                        )}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getStatusText(contact.status)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-0.5">
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title={t('contacts.voiceCall')}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title={t('contacts.videoCall')}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Offline Contacts */}
            {offlineContacts.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-white border-b border-gray-300">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    {t('contacts.offlineContacts')} — {offlineContacts.length}
                  </h3>
                </div>
                {offlineContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelectContact?.(contact)}
                    onContextMenu={(e) => handleContextMenu(e, contact)}
                    className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-white transition-colors text-left border-l-2 border-transparent hover:border-[#1164a3]"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-9 h-9 rounded opacity-60"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#f8f8f8] ${getStatusColor(
                          contact.status
                        )}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-600 truncate">
                        {contact.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {getStatusText(contact.status)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Friend Requests Panel - Redesigned */}
      {showRequestsPanel && (
        <>
          {/* Overlay */}
          <button 
            className="fixed inset-0 bg-black bg-opacity-30 z-40 w-full h-full border-0 cursor-default"
            onClick={() => setShowRequestsPanel(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowRequestsPanel(false)}
            aria-label="Close friend requests panel"
          />
          
          {/* Panel */}
          <div 
            className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col"
            style={{
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <style>{`
              @keyframes slideInRight {
                from {
                  transform: translateX(100%);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
            `}</style>
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#007a5a] to-[#005f46] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{t('contacts.friendRequests.title')}</h3>
                <p className="text-xs text-white/80 mt-0.5">
                  {friendRequests.length} {friendRequests.length === 1 ? t('contacts.friendRequests.pending') : t('contacts.friendRequests.pendingPlural')} {t('contacts.friendRequests.pendingText')}
                </p>
              </div>
              <button
                onClick={() => setShowRequestsPanel(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label={t('contacts.friendRequests.close')}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {friendRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-8 py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">{t('contacts.friendRequests.noPendingRequests')}</h4>
                  <p className="text-sm text-gray-500 text-center leading-relaxed">
                    {t('contacts.friendRequests.noPendingDesc')}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {friendRequests.map((request, index) => (
                    <div 
                      key={request.id} 
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={request.avatar}
                            alt={request.name}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-white shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full shadow-sm">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Time */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-bold text-base text-gray-900 truncate">{request.name}</h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full">
                              {formatTimestamp(request.timestamp)}
                            </span>
                          </div>

                          {/* Message */}
                          {request.message ? (
                            <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-3">
                              <p className="text-xs text-gray-600 leading-relaxed italic">
                                "{request.message}"
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 mb-3">
                              {t('contacts.friendRequests.wantsToConnect')}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#007a5a] to-[#006647] hover:from-[#006647] hover:to-[#005538] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
                            >
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              {t('contacts.friendRequests.accept')}
                            </button>
                            <button
                              onClick={() => handleDeclineRequest(request.id)}
                              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                            >
                              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {t('contacts.friendRequests.decline')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="w-full py-3 bg-white hover:bg-gray-50 text-[#007a5a] font-semibold text-sm rounded-lg border-2 border-[#007a5a] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t('contacts.friendRequests.addNewFriend')}
              </button>
            </div>
          </div>
        </>
      )}

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
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[180px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                onSelectContact?.(contextMenu.contact);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t('contacts.contextMenu.sendMessage')}
            </button>
            <button
              onClick={() => {
                alert(`Voice call to ${contextMenu.contact.name}`);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('contacts.contextMenu.voiceCall')}
            </button>
            <button
              onClick={() => {
                alert(`Video call to ${contextMenu.contact.name}`);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {t('contacts.contextMenu.videoCall')}
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => {
                alert(`View profile: ${contextMenu.contact.name}`);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('contacts.contextMenu.viewProfile')}
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => handleRemoveFriend(contextMenu.contact.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
              </svg>
              {t('contacts.contextMenu.removeFriend')}
            </button>
            <button
              onClick={() => handleBlockContact(contextMenu.contact.id)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              {t('contacts.contextMenu.blockContact')}
            </button>
          </div>
        </>
      )}

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-bold mb-4">{t('contacts.addFriend.title')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t('contacts.addFriend.description')}
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="friend-search" className="block text-sm font-medium mb-1">{t('contacts.addFriend.emailOrUsername')}</label>
                <input
                  id="friend-search"
                  type="text"
                  placeholder={t('contacts.addFriend.emailPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1164a3]"
                />
              </div>
              <div>
                <label htmlFor="friend-message" className="block text-sm font-medium mb-1">{t('contacts.addFriend.message')}</label>
                <textarea
                  id="friend-message"
                  placeholder={t('contacts.addFriend.messagePlaceholder')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1164a3]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddFriendModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
              >
                {t('contacts.addFriend.cancel')}
              </button>
              <button
                onClick={() => {
                  alert(t('contacts.addFriend.requestSent'));
                  setShowAddFriendModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#007a5a] hover:bg-[#006647] rounded"
              >
                {t('contacts.addFriend.sendRequest')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Button */}
      <div className="p-3 border-t border-gray-300 bg-white">
        <button 
          onClick={() => setShowAddFriendModal(true)}
          className="w-full bg-[#007a5a] hover:bg-[#006647] text-white py-2 rounded text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>{t('contacts.addContact')}</span>
        </button>
      </div>
    </div>
  );
};

export default ContactsTab;
