import { Navigate } from 'react-router-dom';
import { userService } from '../services/userService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const currentUser = userService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
