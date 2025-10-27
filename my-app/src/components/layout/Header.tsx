import Button from '@/components/common/Button';
import LanguageSelector from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Header = () => {
  const { t } = useTranslation();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-[#3f0e40] rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">ChatApp</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-[#1164a3] transition-colors font-medium"
            >
              {t('header.home')}
            </Link>
            <Link 
              to="/features" 
              className="text-gray-700 hover:text-[#1164a3] transition-colors font-medium"
            >
              {t('header.features')}
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-[#1164a3] transition-colors font-medium"
            >
              {t('header.about')}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-[#1164a3] transition-colors font-medium"
            >
              {t('header.contact')}
            </Link>
          </nav>

          {/* Auth Buttons & Language Selector */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector />
            <Link to="/login">
              <Button variant="ghost" size="md">
                {t('header.login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="md">
                {t('header.register')}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg 
              className="w-6 h-6 text-gray-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
