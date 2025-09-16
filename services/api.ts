import type { User, Order, ImageEdit, PromptTemplate } from '../types';
import { API_BASE_URL } from '../constants';

/**
 * A helper function to make API requests.
 * It automatically adds the Authorization header if a token is available.
 * It also handles response parsing and error formatting.
 * @param endpoint The API endpoint to call (e.g., '/users/login').
 * @param options The options for the fetch call (method, body, etc.).
 * @returns A promise that resolves with the JSON response.
 */
const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorData;
        try {
            // Try to parse the error response as JSON
            errorData = await response.json();
        } catch (e) {
            // If it's not JSON, use the status text
            errorData = { message: response.statusText };
        }
        // Throw an error with the message from the backend, or a generic one
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    // Handle responses that might not have a body (e.g., 204 No Content)
    if (response.status === 204) {
        return null as T;
    }
    
    return response.json();
};

type AuthResponse = { token: string; user: Omit<User, 'points'> };

// 1. User Register
export const register = async (username: string, password: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

// 2. User Login
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

// 3. Get User Points
export const getPoints = async (): Promise<{ points: number }> => {
  return apiFetch<{ points: number }>('/users/points');
};

// 4. Create Payment Order
type CreateOrderResponse = {
    order: { id: number; amount: number; status: string };
    stripe: { client_secret: string };
};
export const createOrder = async (amount: number): Promise<CreateOrderResponse> => {
  return apiFetch<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
};

// 5. Get prompt templates
type PromptTemplatesResponse = {
    templates: PromptTemplate[];
    total: number;
};
export const getPromptTemplates = async (): Promise<PromptTemplatesResponse> => {
    return apiFetch<PromptTemplatesResponse>('/prompt/templates');
};

// 6. Image Edit
type EditImageResponse = {
    edit_id: number;
    result: string;
    points_remaining: number;
};
export const editImage = async (prompt: string, image: string): Promise<EditImageResponse> => {
  return apiFetch<EditImageResponse>('/image-edits', {
    method: 'POST',
    body: JSON.stringify({ prompt, image }),
  });
};

// 7. Image Edit by Template
export const editImageByTemplate = async (templateId: number, image: string): Promise<EditImageResponse> => {
  return apiFetch<EditImageResponse>('/image-edits/by-template', {
    method: 'POST',
    body: JSON.stringify({ templateId: templateId, image }),
  });
};

// 8. Get User Order History
type OrderHistoryResponse = {
    orders: Order[];
    total: number;
};
export const getOrderHistory = async (): Promise<OrderHistoryResponse> => {
  return apiFetch<OrderHistoryResponse>('/users/orders');
};

// 9. Get User Image Edit History
type EditHistoryResponse = {
    edits: ImageEdit[];
    total: number;
};
export const getImageEditHistory = async (): Promise<EditHistoryResponse> => {
  return apiFetch<EditHistoryResponse>('/users/image-edits?includeResult=true');
};

// 10. Change User Password
export const changePassword = async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/users/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};
