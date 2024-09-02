'use client'

import React from 'react'
import { useToast, Toast as ToastType } from './use-toast'
import { X } from 'lucide-react'

interface ToastProps {
  toast: ToastType
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast()

  return (
    <div className={`flex items-center justify-between p-4 mb-4 rounded-md shadow-md ${
      toast.type === 'success' ? 'bg-green-500' :
      toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`}>
      <p>{toast.message}</p>
      <button onClick={() => removeToast(toast.id)} className="ml-4">
        <X size={18} />
      </button>
    </div>
  )
}

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default Toast