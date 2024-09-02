import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  className = '',
  ...props 
}: ButtonProps): JSX.Element {
  const baseStyles = 'rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
  let variantStyles = ''
  let sizeStyles = ''

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
      break
    case 'secondary':
      variantStyles = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'
      break
    case 'outline':
      variantStyles = 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
      break
    case 'ghost':
      variantStyles = 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
      break
    case 'destructive':
      variantStyles = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
      break
  }

  switch (size) {
    case 'default':
      sizeStyles = 'px-4 py-2'
      break
    case 'sm':
      sizeStyles = 'px-2 py-1 text-sm'
      break
    case 'lg':
      sizeStyles = 'px-6 py-3 text-lg'
      break
    case 'icon':
      sizeStyles = 'p-2'
      break
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}