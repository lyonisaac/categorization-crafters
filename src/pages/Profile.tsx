import { ProfileForm } from '@/components/profile/ProfileForm';

export default function Profile() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      <ProfileForm />
    </div>
  );
}