'use client'

import React from 'react'
import { X } from 'lucide-react'
import { ToasterToast, useToast } from './use-toast'

export const Toast: React.FC<ToasterToast & { onDismiss: () => void }> = ({ 
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

export default Toast

export function ToastContainer(): JSX.Element {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast: ToasterToast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}