import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedProps) => {
  const token = localStorage.getItem("token");
    if (!token) {
      return <Navigate to="/signup" replace />;
    }
    return <>{children}</>;
};

