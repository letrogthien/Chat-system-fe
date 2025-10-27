# MyApp - React + TypeScript + Vite + React Router + Tailwind CSS

A professional, scalable React application built with modern tools and best practices.

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

## 📦 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, icons)
├── components/      # Reusable components
│   ├── common/      # Common UI components (Button, Input, etc.)
│   ├── layout/      # Layout components (Header, Footer, etc.)
│   └── features/    # Feature-specific components
├── pages/           # Page components (routes)
├── routes/          # Route configuration
├── hooks/           # Custom React hooks
├── services/        # API services
├── utils/           # Utility functions
├── constants/       # App constants
├── types/           # TypeScript types
├── store/           # State management
├── styles/          # Global styles
└── config/          # App configuration
```

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features

- ✅ **Path Aliases** - Use `@/` for clean imports
- ✅ **Tailwind CSS** - Utility-first styling with custom theme
- ✅ **React Router** - Client-side routing with layouts
- ✅ **API Integration** - Axios with interceptors
- ✅ **Custom Hooks** - Reusable logic (useLocalStorage, useFetch)
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Component Library** - Pre-built common components
- ✅ **Professional Structure** - Scalable folder organization

## 🔧 Code Style & Conventions

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Import Aliases

```tsx
// Instead of: import Button from '../../components/common/Button'
import Button from '@/components/common/Button';
```

### Component Example

```tsx
import { Button, Input } from '@/components/common';
import { useState } from 'react';

const MyPage = () => {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <Input 
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        label="Username"
      />
      <Button variant="primary">Submit</Button>
    </div>
  );
};

export default MyPage;
```

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Components README](./src/components/common/README.md)
- [Hooks README](./src/hooks/README.md)
- [Services README](./src/services/README.md)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License.
