"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";

type User = {
  id: string;
  email: string;
  role: string;
  trustScore?: number;
};

// Mock Data - Replace with your actual API calls
const mockUsers = [
  { id: "1", email: "user1@example.com", role: "user", trustScore: 85 },
  {
    id: "2",
    email: "maintainer1@example.com",
    role: "maintainer",
    trustScore: 92,
  },
  { id: "3", email: "user2@example.com", role: "user", trustScore: 78 },
];

const mockContributions = [
  {
    id: "c1",
    description: "Resolved critical security vulnerability",
    user: "maintainer1@example.com",
    status: "Approved",
  },
  {
    id: "c2",
    description: "Refactored authentication module",
    user: "user1@example.com",
    status: "Pending",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role === "admin") {
          setUser(data.user);
        } else {
          router.push("/sign-in");
        }
        setIsLoaded(true);
      })
      .catch(() => {
        router.push("/sign-in");
        setIsLoaded(true);
      });
  }, [router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation title="Admin Dashboard" />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              System Overview
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  Total Users
                </h3>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {mockUsers.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  Pending Contributions
                </h3>
                <p className="mt-2 text-3xl font-bold text-orange-500">
                  {
                    mockContributions.filter((c) => c.status === "Pending")
                      .length
                  }
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700">
                  System Health
                </h3>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  Nominal
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                User Management
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trust Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.trustScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Recent Activity
              </h3>
              <ul>
                {mockContributions.map((c) => (
                  <li key={c.id} className="border-b border-gray-200 py-3">
                    <p className="font-medium">{c.description}</p>
                    <p className="text-sm text-gray-500">
                      by {c.user} -{" "}
                      <span
                        className={
                          c.status === "Approved"
                            ? "text-green-600"
                            : "text-orange-500"
                        }
                      >
                        {c.status}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
