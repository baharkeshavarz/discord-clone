import React from 'react'

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({children}) => {
  return (
    <div className="flex justify-center items-center h-full">{children}</div>
  )
}

export default AuthLayout;
