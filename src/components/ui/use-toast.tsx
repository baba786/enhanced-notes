'use client'

import * as React from 'react'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const newToast: Toast = { id: Date.now(), message, type }
    setToasts((prevToasts) => [...prevToasts, newToast])
    setTimeout(() => removeToast(newToast.id), 5000) // Auto remove after 5 seconds
  }, [removeToast])

  return (
    <React.Fragment>
      <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
        {children}
      </ToastContext.Provider>
    </React.Fragment>
  )
}