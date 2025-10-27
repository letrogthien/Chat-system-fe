import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">{t('notFound.title')}</h1>
        <h2 className="text-4xl font-semibold text-gray-900 mt-4 mb-2">
          {t('notFound.subtitle')}
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          {t('notFound.description')}
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            {t('notFound.goHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
