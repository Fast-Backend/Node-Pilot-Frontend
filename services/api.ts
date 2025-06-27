/* eslint-disable @typescript-eslint/no-explicit-any */
// services/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const postData = async <TRequest, TResponse>(
    url: string,
    data: TRequest,
    fileName: string
): Promise<TResponse> => {
    try {
        const response = await api.post(url, data, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/zip' });
        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(downloadUrl);
        return response.data
    } catch (error: any) {
        console.error('Download error:', error);
        throw error?.response?.data || error;
    }
};
