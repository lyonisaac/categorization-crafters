import { TransactionPreview } from '@/components/TransactionPreview/TransactionPreview';

export default function TransactionPreviewPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 font-heading">Transaction Preview</h1>
      <TransactionPreview />
    </div>
  );
}
