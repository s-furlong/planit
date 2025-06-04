'use client';

import { useEffect, useState } from 'react';
import UserList from './components/UserList';

export default function Home() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/ping')
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch((err) => setBackendMessage('Error talking to backend 😢'));
  }, []);

  return (
    <main className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Planit 🌍</h1>
      <UserList />
    </main>
  );
}

