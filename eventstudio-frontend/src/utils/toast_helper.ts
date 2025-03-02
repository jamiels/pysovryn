//this file is used to show toast messages in the application using react-hot-toast library and the function

/**
 * Show toast message
 * @param type 'success' | 'error'
 * @param message string
 * @param options ToastOptions
 * @returns void
 * @example
 * ```tsx
 * showToast('success', 'Event created successfully');
 * ```
 * @example
 * ```tsx
 * showToast('error', 'Failed to create event');
 * ```
 * @example
 * ```tsx
 * showToast('success', 'Event created successfully', { icon: '🎉' });
 * ```
 * @example
 * ```tsx
 * showToast('error', 'Failed to create event', { icon: '❌' });
 *  ```
 */
import { toast } from 'react-hot-toast';
import React from 'react';

type ToastOptions = {
  icon?: string;
  style?: React.CSSProperties;
};

export const showToast = (type: 'success' | 'error', message: string, options?: ToastOptions) => {
  const baseOptions = {
    style: {
      borderRadius: '10px',
      fontSize: '0.80rem',
      background: type === 'success' ? '#333' : '#d32f2f',
      color: '#fff',
      ...options?.style
    },
    icon: options?.icon || (type === 'success' ? '👏' : '❌')
  };

  type === 'success' ? toast.success(message, baseOptions) : toast.error(message, baseOptions);
};
