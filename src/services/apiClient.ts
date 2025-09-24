import { toast } from 'sonner'; // If you're using sonner for toasts

export class AuthenticationError extends Error {
  constructor(message: string, public redirectTo?: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const apiClient = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`http://localhost:8000${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (response.status === 401) {
    // Don't redirect immediately - let components handle it
    throw new AuthenticationError(
      data.message || 'Authentication required',
      data.redirect_to || '/register'
    );
  }

  if (!response.ok) {
    // Show error toast for other errors
    toast.error(data.message || 'Request failed');
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

// Helper function for handling auth errors in components
export const handleAuthError = (error: Error) => {
  if (error instanceof AuthenticationError) {
    // You can show a modal here or redirect
    window.location.href = error.redirectTo || '/register';
  } else {
    console.error('API Error:', error.message);
  }
};