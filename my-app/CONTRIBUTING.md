# Contribution Guidelines

## Code Style

- Follow TypeScript strict mode
- Use functional components with hooks
- Keep components under 300 lines
- Write self-documenting code with clear names
- Add JSDoc comments for complex functions

## Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with "use" prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_TIMEOUT`)
- **Types**: PascalCase (`UserData`, `ApiResponse`)

## Component Structure

```tsx
// 1. Imports (external first, then internal)
import { useState } from 'react';
import { Button } from '@/components/common';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
const MyComponent = ({ title }: Props) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Event handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return <div>{title}</div>;
};

// 7. Export
export default MyComponent;
```

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push and create PR: `git push origin feature/your-feature`

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks
