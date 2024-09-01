import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastOptions {
  message: string
  type: ToastType
  duration?: number
}

interface Toast extends ToastOptions {
  id: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(({ message, type, duration = 3000 }: ToastOptions) => {
    const id = Date.now()
    const newToast: Toast = { id, message, type, duration }
    setToasts(prevToasts => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}