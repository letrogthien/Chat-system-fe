import {
    ChannelsTab,
    ChatArea,
    ChatInfo,
    ChatList,
    ChatSidebar,
    ContactsTab,
    SettingsTab,
} from '@/components/features/chat';
import type { Tab } from '@/components/features/chat/ChatSidebar';
import { useState } from 'react';

export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isTyping?: boolean;
  isGroup?: boolean;
  memberCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'audio';
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  recalled?: boolean;
  edited?: boolean;
}

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showChatInfo, setShowChatInfo] = useState(false);

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    // Auto switch to chats tab when selecting a contact
    if (activeTab !== 'chats') {
      setActiveTab('chats');
    }
  };

  const renderMiddlePanel = () => {
    switch (activeTab) {
      case 'chats':
        return (
          <ChatList 
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
          />
        );
      case 'channels':
        return <ChannelsTab />;
      case 'contacts':
        return <ContactsTab onSelectContact={handleSelectContact} />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar - Navigation */}
      <ChatSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Middle Panel - Dynamic based on active tab */}
      {renderMiddlePanel()}

      {/* Chat Area - Messages (only show in chats tab) */}
      {activeTab === 'chats' && (
        <ChatArea 
          contact={selectedContact}
          onToggleInfo={() => setShowChatInfo(!showChatInfo)}
        />
      )}

      {/* Chat Info - Right Sidebar (only show in chats tab) */}
      {activeTab === 'chats' && showChatInfo && selectedContact && (
        <ChatInfo 
          contact={selectedContact}
          onClose={() => setShowChatInfo(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
