import { Navigate } from 'react-router-dom';
import { userService } from '../services/userService';

interface ProtectedRouteAdminProps {
  children: React.ReactNode;
}

export function ProtectedRouteAdmin({ children }: ProtectedRouteAdminProps) {
  const currentUser = userService.getCurrentUser();

  if (!currentUser || currentUser.email !== 'admin@gmail.com') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
