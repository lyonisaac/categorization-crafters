import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, ResetPasswordForm } from '@/components/auth';
import { useAuth } from '@/hooks';

const ResetPasswordPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <AuthLayout title="Reset your password">
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
