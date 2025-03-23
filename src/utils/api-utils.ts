/**
 * API Utilities
 * 
 * This module provides utility functions for handling API responses and errors.
 */

// Standard API error structure
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Standard API response structure
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

/**
 * Creates a successful API response
 * 
 * @param data - The data to include in the response
 * @returns A standardized successful API response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    success: true
  };
}

/**
 * Creates an error API response
 * 
 * @param status - HTTP status code
 * @param message - Error message
 * @param details - Optional error details
 * @returns A standardized error API response
 */
export function createErrorResponse<T>(
  status: number,
  message: string,
  details?: any
): ApiResponse<T> {
  return {
    error: {
      status,
      message,
      details
    },
    success: false
  };
}

/**
 * Handles API errors and returns a standardized error response
 * 
 * @param error - The caught error
 * @returns A standardized error API response
 */
export function handleApiError<T>(error: any): ApiResponse<T> {
  console.error('API Error:', error);
  
  // Handle different error types
  if (error.status && error.message) {
    // Already formatted as ApiError
    return createErrorResponse(error.status, error.message, error.details);
  } else if (error.response) {
    // Axios-like error with response
    return createErrorResponse(
      error.response.status,
      error.response.data?.message || error.message,
      error.response.data
    );
  } else if (error instanceof Error) {
    // Standard Error object
    return createErrorResponse(500, error.message);
  } else {
    // Unknown error format
    return createErrorResponse(500, 'An unexpected error occurred');
  }
}

/**
 * Wraps an async API function with standardized error handling
 * 
 * @param fn - The async function to wrap
 * @returns A function that returns a standardized API response
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<ApiResponse<T>> {
  return async (...args: Args) => {
    try {
      const result = await fn(...args);
      return createSuccessResponse(result);
    } catch (error) {
      return handleApiError<T>(error);
    }
  };
}

/**
 * Parses and validates environment variables
 * 
 * @param key - Environment variable key
 * @param required - Whether the variable is required
 * @param defaultValue - Default value if not found and not required
 * @returns The environment variable value
 */
export function getEnvVariable(
  key: string,
  required: boolean = true,
  defaultValue: string = ''
): string {
  const value = import.meta.env[`VITE_${key}`] || process.env[key];
  
  if (!value && required) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
  
  return value || defaultValue;
}

/**
 * Formats API request parameters for URL query string
 * 
 * @param params - Object containing query parameters
 * @returns Formatted query string (without the leading ?)
 */
export function formatQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

export default {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  withErrorHandling,
  getEnvVariable,
  formatQueryParams
};
