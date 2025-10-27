import type { Contact } from '@/pages/ChatPage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ContactsTabProps {
  onSelectContact?: (contact: Contact) => void;
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

const ContactsTab = ({ onSelectContact }: ContactsTabProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts] = useState<Contact[]>(mockContacts);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      'online': t('common.active'),
      'away': t('common.away'),
      'busy': 'Busy',
      'offline': t('common.offline')
    };
    return statusMap[status] || t('common.offline');
  };

  // Group contacts by status
  const onlineContacts = filteredContacts.filter(c => c.status === 'online');
  const offlineContacts = filteredContacts.filter(c => c.status !== 'online');

  return (
    <div className="w-64 bg-[#f8f8f8] border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-white shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-2">{t('contacts.title')}</h2>
        
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
            <p className="text-xs">Không tìm thấy liên hệ</p>
          </div>
        ) : (
          <>
            {/* Online Contacts */}
            {onlineContacts.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-white border-b border-gray-300">
                  <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Đang hoạt động — {onlineContacts.length}
                  </h3>
                </div>
                {onlineContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelectContact?.(contact)}
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
                        title="Gọi thoại"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Gọi video"
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
                    Ngoại tuyến — {offlineContacts.length}
                  </h3>
                </div>
                {offlineContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelectContact?.(contact)}
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

      {/* Add Contact Button */}
      <div className="p-3 border-t border-gray-300 bg-white">
        <button className="w-full bg-[#007a5a] hover:bg-[#006647] text-white py-2 rounded text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span>Thêm liên hệ</span>
        </button>
      </div>
    </div>
  );
};

export default ContactsTab;
