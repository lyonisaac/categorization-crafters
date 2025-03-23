import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, RegisterForm } from '@/components/auth';
import { useAuth } from '@/hooks';

const RegisterPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <AuthLayout title="Create a new account">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
