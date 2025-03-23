import { useState, useEffect } from 'react';
import { ynabApi, YnabConnection } from '@/services/ynab-api';
import { useAuth } from './useAuth';

// Hook for managing YNAB connections
export const useYnabConnections = () => {
  const [connections, setConnections] = useState<YnabConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch all connections
  const fetchConnections = async () => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await ynabApi.getConnections();
      if (error) throw error;
      setConnections(data || []);
    } catch (err) {
      console.error('Error fetching YNAB connections:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single connection
  const fetchConnection = async (id: string) => {
    if (!user) return null;

    try {
      const { data, error } = await ynabApi.getConnection(id);
      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`Error fetching YNAB connection ${id}:`, err);
      setError(err as Error);
      return null;
    }
  };

  // Create a new connection
  const createConnection = async (connection: Omit<YnabConnection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await ynabApi.createConnection(connection);
      if (error) throw error;
      
      // Update the local state
      setConnections(prev => [...prev, data as YnabConnection]);
      return data;
    } catch (err) {
      console.error('Error creating YNAB connection:', err);
      setError(err as Error);
      return null;
    }
  };

  // Update an existing connection
  const updateConnection = async (id: string, connection: Partial<Omit<YnabConnection, 'id' | 'user_id' | 'created_at'>>) => {
    if (!user) return null;

    try {
      const { data, error } = await ynabApi.updateConnection(id, connection);
      if (error) throw error;
      
      // Update the local state
      setConnections(prev => prev.map(c => c.id === id ? data as YnabConnection : c));
      return data;
    } catch (err) {
      console.error(`Error updating YNAB connection ${id}:`, err);
      setError(err as Error);
      return null;
    }
  };

  // Delete a connection
  const deleteConnection = async (id: string) => {
    if (!user) return false;

    try {
      const { data, error } = await ynabApi.deleteConnection(id);
      if (error) throw error;
      
      // Update the local state
      setConnections(prev => prev.filter(c => c.id !== id));
      return data;
    } catch (err) {
      console.error(`Error deleting YNAB connection ${id}:`, err);
      setError(err as Error);
      return false;
    }
  };

  // Fetch connections on mount and when user changes
  useEffect(() => {
    fetchConnections();
  }, [user]);

  return {
    connections,
    loading,
    error,
    fetchConnections,
    fetchConnection,
    createConnection,
    updateConnection,
    deleteConnection
  };
};
