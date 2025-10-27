import LanguageSelector from '@/components/common/LanguageSelector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SettingsTab = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="w-64 bg-[#f8f8f8] border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-300 bg-white shadow-sm">
        <h2 className="text-base font-bold text-gray-900">{t('settings.title')}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-3 border-b border-gray-300 bg-white">
          <h3 className="text-[11px] font-semibold text-gray-500 mb-2 uppercase">
            {t('settings.profile')}
          </h3>
          <div className="flex items-center space-x-2 mb-3">
            <img
              src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
              alt="User"
              className="w-12 h-12 rounded"
            />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">{t('settings.userName')}</h4>
              <p className="text-xs text-gray-500">{t('settings.userEmail')}</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition-colors flex items-center justify-center"
          >
            {t('settings.editProfile')}
          </Link>
        </div>

        {/* Preferences */}
        <div className="p-3 border-b border-gray-300">
          <h3 className="text-[11px] font-semibold text-gray-500 mb-2 uppercase">
            {t('settings.preferences')}
          </h3>
          
          <div className="space-y-3">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-900">
                  {t('settings.notifications')}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {t('settings.pushNotifications')}
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  notifications ? 'bg-[#007a5a]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sound */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-900">
                  {t('settings.sound')}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {t('settings.soundNotifications')}
                </p>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  soundEnabled ? 'bg-[#007a5a]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-gray-900">
                  {t('settings.darkMode')}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {t('settings.appearance')}
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-[#007a5a]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">
                {t('settings.language')}
              </h4>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="p-3 border-b border-gray-300">
          <h3 className="text-[11px] font-semibold text-gray-500 mb-2 uppercase">
            {t('settings.privacySecurity')}
          </h3>
          
          <div className="space-y-1">
            <button className="w-full px-2 py-2 flex items-center justify-between hover:bg-white rounded transition-colors text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-gray-700">{t('settings.changePassword')}</span>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full px-2 py-2 flex items-center justify-between hover:bg-white rounded transition-colors text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-xs text-gray-700">{t('settings.privacy')}</span>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full px-2 py-2 flex items-center justify-between hover:bg-white rounded transition-colors text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-xs text-gray-700">{t('settings.blockedList')}</span>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="p-3 border-b border-gray-300">
          <h3 className="text-[11px] font-semibold text-gray-500 mb-2 uppercase">
            {t('settings.about')}
          </h3>
          
          <div className="space-y-1">
            <button className="w-full px-2 py-2 flex items-center justify-between hover:bg-white rounded transition-colors text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-700">{t('settings.helpGuide')}</span>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button className="w-full px-2 py-2 flex items-center justify-between hover:bg-white rounded transition-colors text-left">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-gray-700">{t('settings.termsOfService')}</span>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="px-2 py-2 text-center">
              <p className="text-[10px] text-gray-500">{t('settings.version')}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-3">
          <Link
            to="/login"
            className="w-full px-3 py-2 flex items-center justify-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-semibold text-xs">{t('settings.logout')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
