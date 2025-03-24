import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Rules page
    navigate('/rules');
  }, [navigate]);
  
  return (
    <Layout>
      <div className="flex justify-center items-center h-64">
        <p>Redirecting to Rules page...</p>
      </div>
    </Layout>
  );
};

export default Index;
