# API Services

API integration and HTTP client configuration.

## Files

- **api.ts**: Axios instance with interceptors for authentication and error handling

## Usage

```tsx
import { apiClient } from '@/services/api';

// GET request
const response = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', { name: 'John' });
```

## Creating Service Modules

Create feature-specific service files:

```tsx
// services/userService.ts
import { apiClient } from './api';
import type { User } from '@/types';

export const userService = {
  getAll: () => apiClient.get<User[]>('/users'),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
  create: (data: Partial<User>) => apiClient.post<User>('/users', data),
  update: (id: string, data: Partial<User>) => 
    apiClient.patch<User>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete(`/users/${id}`),
};
```
