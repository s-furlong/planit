'use client';

import { useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/users?page=${pageNum}&limit=5`);
      const data = await res.json();

      setUsers(Array.isArray(data.data) ? data.data : []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch users', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <ul className="space-y-2">
          {Array.isArray(users) && users.map((user) => (
            <li key={user.id} className="border p-2 rounded">
              <p><strong>{user.name || 'Unnamed User'}</strong></p>
              <p>{user.email}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between mt-6 items-center">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

