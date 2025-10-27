import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = t('auth.login.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.login.errors.emailInvalid');
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = t('auth.login.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.login.errors.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call
      console.log('Login data:', { ...formData, rememberMe });
      
      // On success, navigate to home
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ email: t('auth.login.errors.invalidCredentials') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.login.title')}
            </h1>
            <p className="text-gray-600">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={t('auth.login.email')}
              type="email"
              placeholder={t('auth.login.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label={t('auth.login.password')}
              type="password"
              placeholder={t('auth.login.passwordPlaceholder')}
              value={formData.password}
              onChange={handleChange('password')}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {t('auth.login.rememberMe')}
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              {isLoading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t('auth.login.or')}
                </span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            {t('auth.login.noAccount')}{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              {t('auth.login.signUpNow')}
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-600">
          {t('auth.login.termsAgreement')}{' '}
          <Link to="/terms" className="underline hover:text-gray-900">
            {t('auth.login.termsOfService')}
          </Link>{' '}
          {t('auth.login.and')}{' '}
          <Link to="/privacy" className="underline hover:text-gray-900">
            {t('auth.login.privacyPolicy')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
