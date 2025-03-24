import { TransactionSync } from '@/components/ynab/TransactionSync';
import { PageHeader } from '@/components/ui/page-header';

export function TransactionsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Transactions"
        description="View and manage your YNAB transactions"
      />
      <TransactionSync />
    </div>
  );
}

export default TransactionsPage;
