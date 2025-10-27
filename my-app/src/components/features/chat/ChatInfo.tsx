import type { Contact } from '@/pages/ChatPage';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChatInfoProps {
  contact: Contact;
  onClose: () => void;
}

const ChatInfo = ({ contact, onClose }: ChatInfoProps) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const mediaFiles = [
    { id: 1, type: 'image', url: 'https://picsum.photos/200/200?random=1' },
    { id: 2, type: 'image', url: 'https://picsum.photos/200/200?random=2' },
    { id: 3, type: 'image', url: 'https://picsum.photos/200/200?random=3' },
    { id: 4, type: 'image', url: 'https://picsum.photos/200/200?random=4' },
    { id: 5, type: 'image', url: 'https://picsum.photos/200/200?random=5' },
    { id: 6, type: 'image', url: 'https://picsum.photos/200/200?random=6' },
  ];

  const sharedFiles = [
    { id: 1, name: 'document.pdf', size: '2.4 MB', date: '2 ngày trước' },
    { id: 2, name: 'presentation.pptx', size: '5.1 MB', date: '1 tuần trước' },
    { id: 3, name: 'report.docx', size: '890 KB', date: '2 tuần trước' },
  ];

  const handleVoiceCall = () => {
    alert(`Đang gọi tới ${contact.name}...`);
    // TODO: Implement actual voice call functionality
  };

  const handleVideoCall = () => {
    alert(`Đang gọi video tới ${contact.name}...`);
    // TODO: Implement actual video call functionality
  };

  const handleSearch = () => {
    alert('Tìm kiếm trong cuộc trò chuyện');
    // TODO: Implement search in conversation
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    const status = !isMuted ? 'đã tắt' : 'đã bật';
    alert(`Thông báo ${status} cho ${contact.name}`);
  };

  const handleToggleStar = () => {
    setIsStarred(!isStarred);
    const status = !isStarred ? 'đã đánh dấu quan trọng' : 'đã bỏ đánh dấu';
    alert(`${contact.name} ${status}`);
  };

  const handleViewAllMedia = () => {
    alert('Xem tất cả ảnh & video');
    // TODO: Open media gallery modal
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setShowImageModal(true);
  };

  const handleViewAllFiles = () => {
    alert('Xem tất cả file đã chia sẻ');
    // TODO: Open files list modal
  };

  const handleFileClick = (file: { name: string; size: string }) => {
    alert(`Đang tải xuống ${file.name} (${file.size})`);
    // TODO: Implement file download
  };

  const handleBlockUser = () => {
    if (confirm(`Bạn có chắc chắn muốn chặn ${contact.name}?`)) {
      alert(`Đã chặn ${contact.name}`);
      // TODO: Implement block user functionality
    }
  };

  const handleDeleteChat = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa cuộc trò chuyện với ${contact.name}?`)) {
      alert(`Đã xóa cuộc trò chuyện với ${contact.name}`);
      onClose();
      // TODO: Implement delete chat functionality
    }
  };

  return (
    <div className="w-64 bg-[#f8f8f8] border-l border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-white shadow-sm flex items-center justify-between">
        <h3 className="font-bold text-base text-gray-900">{t('chatInfo.about')}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-4 text-center border-b border-gray-300 bg-white">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-20 h-20 rounded mx-auto mb-3"
          />
          <h4 className="font-bold text-base text-gray-900 mb-1">
            {contact.name}
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            {contact.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động'}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3">
            <button 
              onClick={handleVoiceCall}
              className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-600">Gọi</span>
            </button>
            
            <button 
              onClick={handleVideoCall}
              className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-600">Video</span>
            </button>
            
            <button 
              onClick={handleSearch}
              className="flex flex-col items-center space-y-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-[10px] text-gray-600">Tìm</span>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="py-1 border-b border-gray-300">
          <button 
            onClick={handleToggleMute}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-white transition-colors"
          >
            <div className="flex items-center space-x-2">
              {isMuted ? (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              )}
              <span className="text-xs text-gray-700">
                {isMuted ? 'Bật thông báo' : 'Tắt thông báo'}
              </span>
            </div>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            onClick={handleToggleStar}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-white transition-colors"
          >
            <div className="flex items-center space-x-2">
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill={isStarred ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-xs text-gray-700">
                {isStarred ? 'Bỏ đánh dấu' : 'Đánh dấu'}
              </span>
            </div>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Media Section */}
        <div className="py-3 border-b border-gray-300">
          <div className="px-3 mb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900">Ảnh & Video</h4>
            <button 
              onClick={handleViewAllMedia}
              className="text-[10px] text-[#1164a3] hover:underline font-semibold"
            >
              Xem tất cả
            </button>
          </div>
          <div className="px-3 grid grid-cols-3 gap-1.5">
            {mediaFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleImageClick(file.url)}
                className="aspect-square rounded overflow-hidden hover:opacity-80 hover:ring-2 hover:ring-[#1164a3] transition-all"
              >
                <img
                  src={file.url}
                  alt="Media"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Files Section */}
        <div className="py-3 border-b border-gray-300">
          <div className="px-3 mb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900">File đã chia sẻ</h4>
            <button 
              onClick={handleViewAllFiles}
              className="text-[10px] text-[#1164a3] hover:underline font-semibold"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-0.5">
            {sharedFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => handleFileClick(file)}
                className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-white transition-colors group"
              >
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-gray-300 transition-colors">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {file.size} • {file.date}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="py-2">
          <button 
            onClick={handleBlockUser}
            className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-red-50 transition-colors text-red-600 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-xs font-semibold">Chặn người dùng</span>
          </button>
          
          <button 
            onClick={handleDeleteChat}
            className="w-full px-3 py-2 flex items-center space-x-2 hover:bg-red-50 transition-colors text-red-600 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-xs font-semibold">Xóa cuộc trò chuyện</span>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Tải xuống ảnh');
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Tải xuống"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Chia sẻ ảnh');
                }}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Chia sẻ"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInfo;
