import { ProfileForm } from '@/components/profile/ProfileForm';
import Layout from '@/components/Layout';

export default function Profile() {
  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <ProfileForm />
      </div>
    </Layout>
  );
}