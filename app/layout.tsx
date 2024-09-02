import React from 'react'
import { ToastProvider, ToastViewport } from "../components/ui/toast"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  )
}