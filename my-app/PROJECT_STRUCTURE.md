# Project Structure

## Overview
This project follows a professional and scalable folder structure for React + TypeScript + Vite applications.

## Directory Structure

```
src/
├── assets/          # Static assets (images, fonts, icons, svgs)
├── components/      # Reusable React components
│   ├── common/      # Common/shared components (Button, Input, Modal, etc.)
│   ├── layout/      # Layout components (Header, Footer, Sidebar, etc.)
│   └── features/    # Feature-specific components
├── pages/           # Page components (route-level components)
├── routes/          # Route definitions and configuration
├── hooks/           # Custom React hooks
├── services/        # API services and external integrations
├── utils/           # Utility functions and helpers
├── constants/       # Application constants and enums
├── types/           # TypeScript type definitions and interfaces
├── store/           # State management (Redux/Zustand/Context)
├── styles/          # Global styles, themes, and CSS modules
└── config/          # Application configuration files
```

## Folder Descriptions

### `/assets`
Static resources like images, fonts, icons, and SVGs.

### `/components`
- **common/**: Reusable UI components used across the application
- **layout/**: Components that define the page structure (Header, Footer, Sidebar)
- **features/**: Components specific to particular features or modules

### `/pages`
Route-level components that represent entire pages/views.

### `/routes`
React Router configuration and route definitions.

### `/hooks`
Custom React hooks for reusable logic:
- `useLocalStorage` - Local storage management
- `useFetch` - Data fetching with loading/error states
- Add your custom hooks here

### `/services`
API integration and external service connections:
- `api.ts` - Axios instance with interceptors
- Add feature-specific API services here

### `/utils`
Helper functions and utilities:
- `cn.ts` - Tailwind CSS class merging utility
- `formatters.ts` - Data formatting functions
- `validators.ts` - Input validation functions

### `/constants`
Application-wide constants, enums, and configuration values.

### `/types`
TypeScript interfaces, types, and type definitions shared across the app.

### `/store`
State management setup (Redux, Zustand, Context API, etc.).

### `/styles`
Global styles, theme configuration, and CSS modules.

### `/config`
Configuration files for environment variables and app settings.

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use functional components with hooks
   - Place component-specific styles in the same folder

2. **Naming Conventions**
   - Components: PascalCase (`Button.tsx`, `UserProfile.tsx`)
   - Utils/Hooks: camelCase (`useAuth.ts`, `formatDate.ts`)
   - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)

3. **Import Aliases**
   - Use `@/` alias for cleaner imports: `import Button from '@/components/common/Button'`

4. **Type Safety**
   - Define interfaces for props and data structures
   - Use TypeScript strict mode
   - Export types from `/types` folder for reusability

5. **Code Organization**
   - Group related files together
   - Keep files under 300 lines when possible
   - Extract reusable logic into hooks or utilities

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Run development server: `npm run dev`
4. Build for production: `npm run build`
