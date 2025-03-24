import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export function ProfileForm() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setLoadingProfile(true);
      try {
        console.log('Fetching profile for user ID:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: 'Error loading profile',
            description: error.message,
            variant: 'destructive',
          });
          
          // If profile doesn't exist yet, we'll create it when saving
          if (error.code === 'PGRST116') { // No rows returned
            console.log('No profile found, will create on save');
          }
        } else if (data) {
          console.log('Profile data loaded:', data);
          setName(data.full_name || '');
        }
      } catch (err) {
        console.error('Profile loading error:', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    
    loadProfile();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      console.log('Updating profile for user ID:', user.id);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: name,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
        
      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Error updating profile',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Profile updated successfully');
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });
      }
    } catch (err) {
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4 w-full" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}