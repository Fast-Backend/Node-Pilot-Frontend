/* eslint-disable @typescript-eslint/no-explicit-any */
// services/api.ts
import axios from 'axios';

// Axios instance with external backend base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Generic POST helper
export const postData = async <TRequest, TResponse>(
    url: string,
    data: TRequest
): Promise<TResponse> => {
    try {
        const response = await api.post<TResponse>(url, data);
        return response.data;
    } catch (error: any) {
        console.error('POST error:', error);
        throw error?.response?.data || error;
    }
};