import { RuleExecutionTracker } from '@/components/RuleExecutions/RuleExecutionTracker';
import Layout from '@/components/Layout';

export default function RuleExecutionsPage() {
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6 font-heading">Rule Execution History</h1>
        <RuleExecutionTracker />
      </div>
    </Layout>
  );
}
