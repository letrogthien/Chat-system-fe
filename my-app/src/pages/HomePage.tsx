import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-[#3f0e40] rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl font-black text-gray-900 mb-6">
            {t('home.title')}
            <span className="block text-[#1164a3] mt-2">
              {t('home.subtitle')}
            </span>
          </h1>
          
          <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('home.description')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/chat">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8 shadow-md">
                <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('home.getStarted')}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                {t('home.learnMore')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-black text-[#1164a3]">1M+</div>
              <div className="text-sm text-gray-600 mt-1 font-medium">{t('home.stats.users')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#1164a3]">50M+</div>
              <div className="text-sm text-gray-600 mt-1 font-medium">{t('home.stats.messages')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#1164a3]">99.9%</div>
              <div className="text-sm text-gray-600 mt-1 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-[#f8f8f8]">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title={t('home.features.realtime.title')}
            description={t('home.features.realtime.description')}
            color="blue"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title={t('home.features.security.title')}
            description={t('home.features.security.description')}
            color="green"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title={t('home.features.channels.title')}
            description={t('home.features.channels.description')}
            color="purple"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            }
            title={t('home.features.video.title')}
            description={t('home.features.video.description')}
            color="pink"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title={t('home.features.files.title')}
            description={t('home.features.files.description')}
            color="yellow"
          />
          <FeatureCard
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title={t('home.features.search.title')}
            description={t('home.features.search.description')}
            color="indigo"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-[#3f0e40] rounded-lg p-12 text-center text-white shadow-xl">
          <h2 className="text-4xl font-black mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            {t('home.cta.description')}
          </p>
          <Link to="/register">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-[#3f0e40] hover:bg-gray-100 shadow-md"
            >
              {t('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'pink' | 'yellow' | 'indigo';
}

const colorClasses = {
  blue: 'bg-[#1164a3]/10 text-[#1164a3]',
  green: 'bg-[#007a5a]/10 text-[#007a5a]',
  purple: 'bg-[#3f0e40]/10 text-[#3f0e40]',
  pink: 'bg-[#e01e5a]/10 text-[#e01e5a]',
  yellow: 'bg-yellow-100 text-yellow-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-[#1164a3] transition-all">
    <div className={`w-14 h-14 rounded ${colorClasses[color]} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
  </div>
);

export default HomePage;
