import { Suspense } from 'react';
import CallbackClient from './callback-client';

export default function CallbackPage() {
  return (
    <Suspense fallback={<div><h1>Cargando...</h1></div>}>
      <CallbackClient />
    </Suspense>
  );
}