# Common Components

Shared, reusable UI components used throughout the application.

## Components

- **Button**: Customizable button with variants and sizes
- **Input**: Form input with label, error, and helper text support

## Usage Example

```tsx
import { Button, Input } from '@/components/common';

const MyForm = () => {
  return (
    <div>
      <Input 
        label="Email" 
        type="email" 
        placeholder="Enter your email"
        required
      />
      <Button variant="primary" size="lg">
        Submit
      </Button>
    </div>
  );
};
```

## Adding New Components

1. Create a new file: `ComponentName.tsx`
2. Export from `index.ts`
3. Document usage in this README
