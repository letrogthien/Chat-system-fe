import type { Contact, Message } from '@/pages/ChatPage';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatAreaProps {
  contact: Contact | null;
  onToggleInfo: () => void;
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Nguyễn Văn A',
    senderAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
    content: 'Hey! How are you doing?',
    timestamp: '10:30',
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    senderId: 'me',
    senderName: 'Me',
    senderAvatar: 'https://ui-avatars.com/api/?name=Me&background=2563eb&color=fff',
    content: 'I am doing great! Thanks for asking.',
    timestamp: '10:32',
    status: 'read',
    type: 'text',
    replyTo: {
      id: '1',
      senderName: 'Nguyễn Văn A',
      content: 'Hey! How are you doing?',
    },
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'Nguyễn Văn A',
    senderAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff',
    content: 'Do you want to grab coffee later?',
    timestamp: '10:33',
    status: 'delivered',
    type: 'text',
  },
  {
    id: '4',
    senderId: 'me',
    senderName: 'Me',
    senderAvatar: 'https://ui-avatars.com/api/?name=Me&background=2563eb&color=fff',
    content: 'Sure! What time works for you?',
    timestamp: '10:35',
    status: 'sent',
    type: 'text',
    replyTo: {
      id: '3',
      senderName: 'Nguyễn Văn A',
      content: 'Do you want to grab coffee later?',
    },
  },
];

const ChatArea = ({ contact, onToggleInfo }: ChatAreaProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<{
    type: 'image' | 'file';
    content: string;
    fileName?: string;
    fileSize?: string;
  } | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [messageMenuId, setMessageMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    senderName: string;
    content: string;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    messageId: string | null;
    type: 'delete' | 'recall' | null;
  }>({ show: false, messageId: null, type: null });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Calculate max height as 50% of viewport height
      const maxHeight = window.innerHeight * 0.5;
      // Set height based on scrollHeight, with min (38px) and max (50vh) constraints
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 38), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target as Node)) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() && !attachedImage) return;
    if (!contact) return;

    // Send text message if there's text
    const trimmedContent = inputValue.trim();
    if (trimmedContent) {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: 'Me',
        senderAvatar: 'https://ui-avatars.com/api/?name=Me&background=2563eb&color=fff',
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'sending',
        type: 'text',
        ...(replyingTo && { 
          replyTo: {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            content: replyingTo.content
          }
        })
      };

      setMessages([...messages, newMessage]);

      // Simulate message sent
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
      }, 500);
    }

    // Send image if attached
    if (attachedImage) {
      const imageMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'me',
        senderName: 'Me',
        senderAvatar: 'https://ui-avatars.com/api/?name=Me&background=2563eb&color=fff',
        content: attachedImage,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: 'sending',
        type: 'image',
      };

      setMessages((prev) => [...prev, imageMessage]);

      // Simulate message sent
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === imageMessage.id ? { ...msg, status: 'sent' } : msg
          )
        );
      }, 500);
    }

    setInputValue('');
    setAttachedImage(null);
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputValue(inputValue + emoji);
    inputRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);

    // Show preview modal instead of sending immediately
    setPreviewData({
      type: 'file',
      content: `📎 ${fileName}`,
      fileName,
      fileSize: `${fileSize} KB`,
    });
    setShowPreviewModal(true);

    // Reset input
    e.target.value = '';
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      // Set attached image instead of showing preview modal
      setAttachedImage(imageUrl);
      setShowAttachmentMenu(false);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startCamera = async () => {
    setShowCameraModal(true);
    setShowAttachmentMenu(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.');
      setShowCameraModal(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/png');

      // Set attached image instead of showing preview modal
      setAttachedImage(imageUrl);
      stopCamera();
    }
  };

  const shareLocation = () => {
    setShowAttachmentMenu(false);

    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: 'https://ui-avatars.com/api/?name=Me&background=2563eb&color=fff',
      content: '📍 Đang lấy vị trí...',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
      type: 'text',
    };

    setMessages([...messages, newMessage]);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id 
              ? { 
                  ...msg, 
                  content: `📍 Vị trí của tôi\n${locationUrl}`,
                  status: 'sent' 
                } 
              : msg
          )
        );
      },
      (error) => {
        console.error('Error getting location:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id 
              ? { 
                  ...msg, 
                  content: '❌ Không thể lấy vị trí. Vui lòng cho phép quyền truy cập vị trí.',
                  status: 'sent' 
                } 
              : msg
          )
        );
      }
    );
  };

  const sendPreviewedFile = () => {
    if (!previewData) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      senderAvatar: 'https://ui-avatars.com/api/?name=Me&background=2563eb&color=fff',
      content: previewData.type === 'image' ? previewData.content : `📎 ${previewData.fileName} (${previewData.fileSize})`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
      type: previewData.type,
    };

    setMessages([...messages, newMessage]);

    // Simulate upload
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);

    // Close preview modal
    setShowPreviewModal(false);
    setPreviewData(null);
  };

  const cancelPreview = () => {
    setShowPreviewModal(false);
    setPreviewData(null);
  };

  // Message actions
  const handleDeleteMessage = (messageId: string) => {
    setShowDeleteConfirm({ show: true, messageId, type: 'delete' });
    setMessageMenuId(null);
  };

  const handleRecallMessage = (messageId: string) => {
    setShowDeleteConfirm({ show: true, messageId, type: 'recall' });
    setMessageMenuId(null);
  };

  const confirmAction = () => {
    if (!showDeleteConfirm.messageId) return;

    if (showDeleteConfirm.type === 'delete') {
      setMessages(prev => prev.filter(msg => msg.id !== showDeleteConfirm.messageId));
    } else if (showDeleteConfirm.type === 'recall') {
      setMessages(prev => prev.map(msg => 
        msg.id === showDeleteConfirm.messageId
          ? { ...msg, content: t('chat.actions.recalled') || 'Message recalled', type: 'text' as const, recalled: true }
          : msg
      ));
    }

    setShowDeleteConfirm({ show: false, messageId: null, type: null });
  };

  const cancelAction = () => {
    setShowDeleteConfirm({ show: false, messageId: null, type: null });
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditingContent(currentContent);
    setMessageMenuId(null);
  };

  const handleSaveEdit = (messageId: string) => {
    if (!editingContent.trim()) return;
    
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, content: editingContent, edited: true }
        : msg
    ));
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setMessageMenuId(null);
  };

  const handleForwardMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      // TODO: Implement forward functionality
    }
    setMessageMenuId(null);
  };

  const handleReplyMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setReplyingTo({
        id: message.id,
        senderName: message.senderName,
        content: message.content
      });
      inputRef.current?.focus();
    }
    setMessageMenuId(null);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  const handleAttachmentClick = (type: string) => {
    setShowAttachmentMenu(false);
    
    switch (type) {
      case 'file':
        fileInputRef.current?.click();
        break;
      case 'image':
        imageInputRef.current?.click();
        break;
      case 'camera':
        startCamera();
        break;
      case 'location':
        shareLocation();
        break;
      default:
        break;
    }
  };

  // Common emojis
  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👏', '🙌', '👐', '🤲', '🙏', '✍️', '💪', '🦾',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
    '🔥', '✨', '💫', '⭐', '🌟', '💯', '✅', '❌',
  ];

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('common.welcome')}</h3>
          <p className="text-gray-600 text-sm">{t('common.selectConversation')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header - Slack Style */}
      <div className="bg-white border-b border-gray-300 px-5 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-9 h-9 rounded"
            />
            <div
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{contact.name}</h3>
            <p className="text-xs text-gray-600">
              {contact.status === 'online' ? t('common.active') : t('common.away')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title={t('common.search')}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title={t('common.call')}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button 
            onClick={onToggleInfo}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
            title={t('common.details')}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white">
        {messages.map((message) => {
          const isMe = message.senderId === 'me';
          const isEditing = editingMessageId === message.id;
          const isRecalled = (message as any).recalled;
          
          return (
            <div
              key={message.id}
              ref={(el) => {
                messageRefs.current[message.id] = el;
              }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative transition-all duration-300 ${
                highlightedMessageId === message.id ? 'bg-yellow-100 -mx-4 px-4 rounded-lg' : ''
              }`}
            >
              <div className={`flex space-x-2 max-w-[65%] ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                {!isMe && (
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-9 h-9 rounded flex-shrink-0"
                  />
                )}

                {/* Message Bubble */}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} relative`}>
                  {!isMe && (
                    <span className="text-xs font-bold text-gray-900 mb-1 px-3">
                      {message.senderName}
                    </span>
                  )}
                  
                  {isEditing ? (
                    // Edit mode
                    <div className="bg-white border-2 border-primary-500 rounded-lg p-2 min-w-[200px]">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                          onClick={() => handleSaveEdit(message.id)}
                          className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded"
                        >
                          {t('common.send')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`px-3 py-2 rounded-lg relative ${
                          isRecalled
                            ? 'bg-gray-50 text-gray-500 italic border border-gray-200'
                            : isMe
                            ? 'bg-[#1164a3] text-white'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                        }`}
                      >
                        {/* Replied Message Quote */}
                        {(message as any).replyTo && (
                          <div 
                            className={`mb-2 pb-2 border-l-2 pl-2 cursor-pointer hover:bg-black/5 rounded transition-colors ${isMe ? 'border-white/30' : 'border-gray-400'}`}
                            onClick={() => scrollToMessage((message as any).replyTo.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                scrollToMessage((message as any).replyTo.id);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                          >
                            <div className={`text-xs font-semibold ${isMe ? 'text-white/90' : 'text-gray-600'}`}>
                              {(message as any).replyTo.senderName}
                            </div>
                            <div className={`text-xs truncate ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                              {(message as any).replyTo.content}
                            </div>
                          </div>
                        )}
                        
                        {message.type === 'image' ? (
                          <img 
                            src={message.content} 
                            alt="Shared" 
                            className="max-w-[250px] sm:max-w-xs rounded cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.content, '_blank')}
                          />
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                            {(message as any).edited && !isRecalled && (
                              <span className="text-xs opacity-70 ml-2">{t('chat.actions.edited')}</span>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <div className="flex items-center space-x-1 mt-1 px-2">
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        {isMe && !isRecalled && (
                          <span>
                            {message.status === 'read' && (
                              <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            )}
                            {message.status === 'sent' && (
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                      
                      {/* Message Actions Menu - Show on hover below message */}
                      {!isRecalled && (
                        <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1 bg-white border border-gray-200 rounded-lg shadow-md p-1">
                            <button
                              onClick={() => handleReplyMessage(message.id)}
                              className="p-1.5 hover:bg-gray-100 rounded"
                              title={t('chat.actions.reply')}
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                              </svg>
                            </button>
                            {message.type === 'text' && (
                              <button
                                onClick={() => handleCopyMessage(message.content)}
                                className="p-1.5 hover:bg-gray-100 rounded"
                                title={t('chat.actions.copy')}
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            )}
                            {isMe && message.type === 'text' && (
                              <button
                                onClick={() => handleEditMessage(message.id, message.content)}
                                className="p-1.5 hover:bg-gray-100 rounded"
                                title={t('chat.actions.edit')}
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                            {isMe && (
                              <>
                                <button
                                  onClick={() => handleRecallMessage(message.id)}
                                  className="p-1.5 hover:bg-gray-100 rounded"
                                  title={t('chat.actions.recall')}
                                >
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="p-1.5 hover:bg-red-50 rounded"
                                  title={t('chat.actions.delete')}
                                >
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-6 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>{contact.name} đang nhập...</span>
          </div>
        </div>
      )}

      {/* Input Area - Slack Style */}
      <div className="px-5 pb-5 pt-2 bg-white">
        <div className="flex items-end space-x-2">
          {/* Left Actions - Outside Border */}
          <div className="flex items-center space-x-1 pb-2">
            {/* Attachment Button */}
            <div className="relative" ref={attachmentMenuRef}>
              <button 
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Attach"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Attachment Menu */}
              {showAttachmentMenu && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-300 p-1.5 w-56 z-50">
                  <button
                    onClick={() => handleAttachmentClick('file')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#1164a3]/10 rounded-md transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{t('chat.attachments.document')}</p>
                      <p className="text-xs text-gray-500">{t('chat.attachments.documentDesc')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick('image')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#1164a3]/10 rounded-md transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{t('chat.attachments.photo')}</p>
                      <p className="text-xs text-gray-500">{t('chat.attachments.photoDesc')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick('camera')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#1164a3]/10 rounded-md transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{t('chat.attachments.camera')}</p>
                      <p className="text-xs text-gray-500">{t('chat.attachments.cameraDesc')}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAttachmentClick('location')}
                    className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-[#1164a3]/10 rounded-md transition-colors text-left"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{t('chat.attachments.location')}</p>
                      <p className="text-xs text-gray-500">{t('chat.attachments.locationDesc')}</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Emoji Button */}
            <div className="relative" ref={emojiPickerRef}>
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Emoji"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-300 p-3 w-72 z-50">
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
                      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
                      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
                      '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨',
                      '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
                      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
                      '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵',
                      '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟',
                      '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleEmojiClick(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-xl transition-all hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Box with Border */}
          <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#1164a3] focus-within:shadow-sm transition-all">
            {/* Reply Preview */}
            {replyingTo && (
              <div className="mx-2 mt-2 p-2 bg-blue-50 border-l-4 border-primary-500 rounded flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-primary-600 mb-0.5">
                    {t('chat.actions.reply')} {replyingTo.senderName}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {replyingTo.content}
                  </div>
                </div>
                <button
                  onClick={handleCancelReply}
                  className="ml-2 p-1 hover:bg-gray-200 rounded"
                  title={t('common.cancel')}
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Attached Image Preview */}
            {attachedImage && (
              <div className="px-3 pt-3 pb-2 border-b border-gray-200 bg-gray-50">
                <div className="relative inline-block">
                  <img
                    src={attachedImage}
                    alt="Attached"
                    className="h-20 rounded border border-gray-300"
                  />
                  <button
                    onClick={() => setAttachedImage(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat.messagePlaceholder', { name: contact.name })}
              className="w-full px-3 py-2.5 resize-none focus:outline-none text-sm placeholder-gray-500 overflow-y-auto"
              rows={1}
              style={{
                minHeight: '38px',
                maxHeight: '50vh',
              }}
            />
          </div>

          {/* Send Button - Outside Border */}
          <div className="pb-2">
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() && !attachedImage}
              className={`p-2 rounded transition-all ${
                inputValue.trim() || attachedImage
                  ? 'bg-[#007a5a] hover:bg-[#006644] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              title="Send"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        onChange={handleImageSelect}
        accept="image/*,video/*"
      />

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full mx-4">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('chat.camera.title')}</h3>
              <button
                onClick={stopCamera}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Preview */}
            <div className="relative bg-black">
              <video
                ref={videoRef}
                className="w-full h-auto"
                autoPlay
                playsInline
                muted
              />
            </div>

            {/* Footer */}
            <div className="bg-gray-100 px-6 py-4 flex items-center justify-center space-x-4">
              <button
                onClick={stopCamera}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
              >
                {t('chat.camera.cancel')}
              </button>
              <button
                onClick={capturePhoto}
                className="px-8 py-2 bg-[#007a5a] hover:bg-[#006644] text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t('chat.camera.capture')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
            {/* Header */}
            <div className="bg-[#3f0e40] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('chat.preview.title')}</h3>
              <button
                onClick={cancelPreview}
                className="p-1 hover:bg-[#2d0a2f] rounded transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 max-h-[60vh] overflow-auto bg-[#f8f8f8]">
              {previewData.type === 'image' ? (
                <div className="flex justify-center">
                  <img
                    src={previewData.content}
                    alt="Preview"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="bg-white border border-gray-300 rounded-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">{previewData.fileName}</p>
                      <p className="text-sm text-gray-600 mt-1">{t('chat.preview.size')}: {previewData.fileSize}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-300">
              <button
                onClick={cancelPreview}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-semibold transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={sendPreviewedFile}
                className="px-8 py-2 bg-[#007a5a] hover:bg-[#006644] text-white rounded font-semibold transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{t('common.send')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Recall Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {showDeleteConfirm.type === 'delete' 
                  ? (t('chat.actions.confirmDeleteTitle') || 'Delete Message')
                  : (t('chat.actions.confirmRecallTitle') || 'Recall Message')}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700">
                {showDeleteConfirm.type === 'delete'
                  ? (t('chat.actions.confirmDelete') || 'Are you sure you want to delete this message? This action cannot be undone.')
                  : (t('chat.actions.confirmRecall') || 'Recall this message for everyone? This action cannot be undone.')}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={cancelAction}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded transition-colors ${
                  showDeleteConfirm.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#007a5a] hover:bg-[#006644]'
                }`}
              >
                {showDeleteConfirm.type === 'delete'
                  ? (t('chat.actions.delete') || 'Delete')
                  : (t('chat.actions.recall') || 'Recall')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
