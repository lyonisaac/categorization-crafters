import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, LoginForm } from '@/components/auth';
import { useAuth } from '@/hooks';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <AuthLayout title="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
