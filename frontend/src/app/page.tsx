'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/ping')
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch((err) => setBackendMessage('Error talking to backend 😢'));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Planit 🌍</h1>
      <p className="text-xl text-blue-500">{backendMessage}</p>
    </main>
  );
}

