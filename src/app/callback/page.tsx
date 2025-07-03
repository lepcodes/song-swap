"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useServiceStore } from '@/stores/useServiceStore';
import { Message } from '@/types/services';

export default function Close() {
  const searchParams = useSearchParams();
  const isAuthenticated = useServiceStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useServiceStore((state) => state.setIsAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const {originService} = useServiceStore((state) => state)
  
  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (code) {
      console.log('Código de autorización encontrado:', code);
      fetch('/api/auth/exchange-code'+'?code='+code+'&service='+originService?.key)
      .then(response => response.json())
      .then(data => {
        const success = data.success;
        if (success) {
          const channel = new BroadcastChannel('auth');
          const message: Message = 'success';
          channel.postMessage(message);
          channel.close();
          setIsAuthenticated(true);
          window.close()
        }
      })
      .catch(error => {
        const channel = new BroadcastChannel('auth');
        const message: Message = 'error';
        channel.postMessage(message);
        channel.close();
        setError(error);
        setIsAuthenticated(false);
      });
      
    } else if (errorParam) {
      const channel = new BroadcastChannel('auth');
      const message: Message = 'error';
      channel.postMessage(message);
      channel.close();
      setError(errorParam);
      setIsAuthenticated(false);
    }
  }, [searchParams, setIsAuthenticated, originService]);

  return (
    <div>
      {isAuthenticated && <h1>Autenticación exitosa</h1>}
      {!isAuthenticated && <h1>Autenticando...</h1>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}