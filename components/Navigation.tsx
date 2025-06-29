"use client";

import Link from "next/link";

interface NavigationProps {
  title: string;
}

export default function Navigation({ title }: NavigationProps) {
  return (
    <nav className="bg-white shadow mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700">{title}</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <button
            onClick={() => {
              // Remove JWT cookie and redirect to sign-in
              document.cookie = "token=; Max-Age=0; path=/;";
              window.location.href = "/sign-in";
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
