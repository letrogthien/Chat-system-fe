# Custom Hooks

Reusable React hooks for common functionality.

## Available Hooks

### `useLocalStorage`
Manage localStorage with React state synchronization.

```tsx
const [user, setUser, removeUser] = useLocalStorage('user', null);
```

### `useFetch`
Fetch data with loading and error states.

```tsx
const { data, loading, error, refetch } = useFetch('/api/users');
```

## Creating Custom Hooks

1. Create a new file with "use" prefix: `useMyHook.ts`
2. Export from `index.ts`
3. Document usage here
