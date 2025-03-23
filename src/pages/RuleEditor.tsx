
import React from 'react';
import Layout from '@/components/Layout';
import RuleForm from '@/components/RuleForm';
import { TooltipProvider } from '@/components/ui/tooltip';

const RuleEditor: React.FC = () => {
  return (
    <Layout>
      <TooltipProvider>
        <RuleForm />
      </TooltipProvider>
    </Layout>
  );
};

export default RuleEditor;
