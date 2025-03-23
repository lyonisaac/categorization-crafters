import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks';

/**
 * ProtectedRoute component
 * 
 * Wraps routes that require authentication. If the user is not authenticated,
 * they will be redirected to the login page.
 */
export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
