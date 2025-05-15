import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

// Generic hook for fetching data from MongoDB collections via the API
export function useMongoCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Function to manually refresh data
  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let result: T[];
        
        // Handle different collection types
        if (collectionName === 'operadores' || collectionName === 'funcionarios') {
          // Both operadores and funcionarios use the same collection
          result = await apiService.getFuncionarios() as unknown as T[];
        } else {
          // For other collections, you can add more cases or implement a generic fetch
          throw new Error(`Collection ${collectionName} not implemented yet`);
        }
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [collectionName, refreshTrigger]);

  return { data, loading, error, refreshData };
}





