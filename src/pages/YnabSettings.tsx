// src/pages/YnabSettings.tsx
import { Layout } from '@/components/Layout';
import { ApiKeyManager } from '@/components/ynab/ApiKeyManager';

export default function YnabSettings() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">YNAB Settings</h1>
        <ApiKeyManager />
      </div>
    </Layout>
  );
}