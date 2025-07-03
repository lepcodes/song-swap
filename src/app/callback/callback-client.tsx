"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useServiceStore } from '@/stores/useServiceStore';
import { Message } from '@/types/services';

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const isAuthenticated = useServiceStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useServiceStore((state) => state.setIsAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const {originService} = useServiceStore((state) => state)
  
  // Aquí va exactamente el mismo hook useEffect que en la otra solución
  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (code) {
      fetch('/api/auth/exchange-code'+'?code='+code+'&service='+originService?.key)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const channel = new BroadcastChannel('auth');
          channel.postMessage('success' as Message);
          channel.close();
          setIsAuthenticated(true);
          window.close();
        }
      })
      .catch(err => {
        const channel = new BroadcastChannel('auth');
        channel.postMessage('error' as Message);
        channel.close();
        setError(err.message || 'An unknown error occurred');
        setIsAuthenticated(false);
      });
    } else if (errorParam) {
      const channel = new BroadcastChannel('auth');
      channel.postMessage('error' as Message);
      channel.close();
      setError(errorParam);
      setIsAuthenticated(false);
    }
  }, [searchParams, setIsAuthenticated, originService]);

  return (
    <div>
      {isAuthenticated && <h1>Autenticación exitosa</h1>}
      {!isAuthenticated && !error && <h1>Autenticando...</h1>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}