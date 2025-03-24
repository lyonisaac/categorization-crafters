import { TransactionPreview } from '@/components/TransactionPreview/TransactionPreview';
import Layout from '@/components/Layout';

export default function TransactionPreviewPage() {
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6 font-heading">Transaction Preview</h1>
        <TransactionPreview />
      </div>
    </Layout>
  );
}
