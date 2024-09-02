"use client"

import { Toast } from "@/components/ui/Toast"
import { useToast, ToasterToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast: ToasterToast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}