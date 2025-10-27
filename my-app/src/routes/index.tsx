import MainLayout from '@/components/layout/MainLayout';
import ChatPage from '@/pages/ChatPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import RegisterPage from '@/pages/RegisterPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Define your routes here
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Add more routes here
      // {
      //   path: 'about',
      //   element: <AboutPage />,
      // },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default router;
