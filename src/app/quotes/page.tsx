'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuotesPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const currentUser = localStorage.getItem('current_user');
    if (!currentUser) {
      router.push('/');
    }
  }, [router]);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cotizaciones</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Sistema de cotizaciones disponible.</p>
          <button onClick={() => router.push('/dashboard')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Volver al Dashboard</button>
        </div>
      </div>
    </div>
  );
}