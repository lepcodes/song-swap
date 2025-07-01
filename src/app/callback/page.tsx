"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useServiceStore } from '@/stores/useServiceStore';

export default function Close() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
          console.log('Código de autorización procesado exitosamente');
          const channel = new BroadcastChannel('auth');
          channel.postMessage('success');
          channel.close();
          setIsAuthenticated(true);
          window.close();
        }
      })
      .catch(error => {
        console.error('Error al procesar código de autorización:', error);
        setError(error);
        const channel = new BroadcastChannel('auth');
        channel.postMessage('fail');
        channel.close();
      });
      
    } else if (errorParam) {
      console.error('Error de autorización recibido:', errorParam);
      setError(errorParam);
      const channel = new BroadcastChannel('auth');
      channel.postMessage('fail');
      channel.close();
    }

  }, [searchParams, originService]);

  return (
    <div>
      {isAuthenticated && <h1>Autenticación exitosa</h1>}
      {!isAuthenticated && <h1>Autenticando...</h1>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}