// Environment configuration

interface EnvConfig {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

export const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
};

// Validate required environment variables
const requiredEnvVars: string[] = [
  // Add required env vars here
  // 'VITE_API_BASE_URL',
];

requiredEnvVars.forEach((envVar) => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export default env;
