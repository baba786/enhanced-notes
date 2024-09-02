'use client'

import React, { createContext, useContext, useState } from 'react'
import { X } from 'lucide-react'
import { ToastProps } from './use-toast'

type ToastType = ToastProps & {
  id: string
}

type ToastContextType = {
  toast: (toast: Omit<ToastType, 'id'>) => void
  toasts: ToastType[]
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const toast = (newToast: Omit<ToastType, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [...prevToasts, { ...newToast, id }])
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const Toast: React.FC<ToastType & { onDismiss: () => void }> = ({ 
  title, 
  description, 
  action, 
  variant = 'default',
  onDismiss 
}) => {
  return (
    <div className={`flex items-center justify-between p-4 mb-4 rounded-md shadow-md ${
      variant === 'success' ? 'bg-green-500' :
      variant === 'destructive' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`}>
      <div>
        <h3 className="font-semibold">{title}</h3>
        {description && <p className="text-sm">{description}</p>}
      </div>
      <div className="flex items-center">
        {action}
        <button onClick={onDismiss} className="ml-4">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer(): JSX.Element {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}