"use client"
import React, { useEffect } from 'react'
import { useToast } from "../../hooks/use-toast"

export default function LoginPage(): JSX.Element {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: "Welcome",
      description: "This is the login page",
    })
  }, [toast])

  return (
    <div>
      <h1>Login Page</h1>
      {/* Add your login form and other components */}
    </div>
  )
}