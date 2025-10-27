/**
 * Utility functions for validation
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (basic)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replaceAll(/\D/g, '').length >= 10;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Min length validation
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Max length validation
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Number range validation
export const inRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};
