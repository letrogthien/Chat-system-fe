import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CloudFile {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'document' | 'video' | 'audio' | 'other';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  thumbnail?: string;
  shared?: boolean;
}

type FileFilter = 'all' | 'images' | 'documents' | 'videos' | 'recent';

const mockFiles: CloudFile[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'document',
    size: '2.5 MB',
    uploadedBy: 'Nguyễn Văn A',
    uploadedAt: '2 giờ trước',
    shared: true,
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    type: 'image',
    size: '1.8 MB',
    uploadedBy: 'Trần Thị B',
    uploadedAt: '1 ngày trước',
    thumbnail: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'Meeting Recording.mp4',
    type: 'video',
    size: '45.2 MB',
    uploadedBy: 'Lê Văn C',
    uploadedAt: '3 ngày trước',
    shared: true,
  },
  {
    id: '4',
    name: 'Design Assets',
    type: 'folder',
    size: '12 files',
    uploadedBy: 'Phạm Thị D',
    uploadedAt: '1 tuần trước',
  },
  {
    id: '5',
    name: 'Budget Report.xlsx',
    type: 'document',
    size: '856 KB',
    uploadedBy: 'Hoàng Văn E',
    uploadedAt: '2 tuần trước',
  },
];

const FilesTab = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FileFilter>('all');
  const [files, setFiles] = useState<CloudFile[]>(mockFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFilesList = Array.from(e.target.files || []);
    setSelectedFiles(selectedFilesList);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Simulate file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Wait for upload to complete
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add files to the list
    const newFiles: CloudFile[] = selectedFiles.map((file, index) => {
      const getFileType = (name: string): CloudFile['type'] => {
        const ext = name.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
        if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'video';
        if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'audio';
        if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext || '')) return 'document';
        return 'other';
      };

      return {
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: getFileType(file.name),
        size: formatFileSize(file.size),
        uploadedBy: 'You',
        uploadedAt: 'Just now',
      };
    });

    setFiles([...newFiles, ...files]);
    setUploading(false);
    setUploadProgress(0);
    setShowUploadModal(false);
    setSelectedFiles([]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFilteredFiles = () => {
    // Apply filter
    let filteredFiles;
    switch (activeFilter) {
      case 'images':
        filteredFiles = files.filter(file => file.type === 'image');
        break;
      case 'documents':
        filteredFiles = files.filter(file => file.type === 'document');
        break;
      case 'videos':
        filteredFiles = files.filter(file => file.type === 'video');
        break;
      case 'recent':
        filteredFiles = files.slice(0, 3);
        break;
      default:
        filteredFiles = files;
    }

    // Apply search
    if (searchQuery) {
      filteredFiles = filteredFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredFiles;
  };

  const filteredFiles = getFilteredFiles();

  const getFileIcon = (type: CloudFile['type']) => {
    switch (type) {
      case 'folder':
        return (
          <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="w-80 bg-[#f8f8f8] border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-300 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">{t('files.title') || 'Cloud Files'}</h2>
          <div className="flex items-center gap-1">
            {/* View Toggle */}
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder={t('files.searchPlaceholder') || 'Search files...'}
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
      <div className="flex bg-white border-b border-gray-300 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-1 py-2 px-2 font-semibold transition-colors whitespace-nowrap ${
            activeFilter === 'all'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('files.filters.all') || 'All'}
        </button>
        <button
          onClick={() => setActiveFilter('recent')}
          className={`flex-1 py-2 px-2 font-semibold transition-colors whitespace-nowrap ${
            activeFilter === 'recent'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('files.filters.recent') || 'Recent'}
        </button>
        <button
          onClick={() => setActiveFilter('images')}
          className={`flex-1 py-2 px-2 font-semibold transition-colors whitespace-nowrap ${
            activeFilter === 'images'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('files.filters.images') || 'Images'}
        </button>
        <button
          onClick={() => setActiveFilter('documents')}
          className={`flex-1 py-2 px-2 font-semibold transition-colors whitespace-nowrap ${
            activeFilter === 'documents'
              ? 'text-[#1164a3] border-b-2 border-[#1164a3]'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {t('files.filters.documents') || 'Docs'}
        </button>
      </div>

      {/* Storage Info */}
      <div className="p-3 bg-blue-50 border-b border-gray-300">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">{t('files.storage') || 'Storage'}</span>
          <span className="text-xs text-gray-600">45.2 GB / 100 GB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-[#1164a3] h-1.5 rounded-full" style={{ width: '45.2%' }}></div>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredFiles.length === 0 ? (
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <p className="text-sm">{t('files.noFiles') || 'No files found'}</p>
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              // List View
              <div className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#1164a3] transition-colors">
                            {file.name}
                          </h3>
                          {file.shared && (
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                          )}
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500 space-x-2">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.uploadedBy}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">{file.uploadedAt}</div>
                      </div>

                      {/* Actions */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-2 gap-3 p-3">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-[#1164a3] transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center text-center">
                      {getFileIcon(file.type)}
                      <h3 className="mt-2 text-xs font-semibold text-gray-900 truncate w-full group-hover:text-[#1164a3]">
                        {file.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Button */}
      <div className="p-3 border-t border-gray-300 bg-white">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-full bg-[#007a5a] hover:bg-[#006644] text-white py-2 rounded-md font-medium text-sm flex items-center justify-center space-x-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>{t('files.upload') || 'Upload File'}</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {t('files.uploadModal.title') || 'Upload Files'}
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                  setUploadProgress(0);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1164a3] transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600 mb-1">
                  {t('files.uploadModal.dragDrop') || 'Drag & drop files here'}
                </p>
                <p className="text-xs text-gray-400">
                  {t('files.uploadModal.or') || 'or click to browse'}
                </p>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    {t('files.uploadModal.selectedFiles') || 'Selected Files'} ({selectedFiles.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedFiles.map((file) => (
                      <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 truncate">{file.name}</span>
                        </div>
                        <span className="text-gray-500 ml-2 flex-shrink-0">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      {t('files.uploadModal.uploading') || 'Uploading...'}
                    </span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#007a5a] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                  setUploadProgress(0);
                }}
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                {t('common.cancel') || 'Cancel'}
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-[#007a5a] hover:bg-[#006644] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading 
                  ? (t('files.uploadModal.uploading') || 'Uploading...') 
                  : (t('files.uploadModal.upload') || 'Upload')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesTab;
