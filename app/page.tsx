"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">
          Trust Platform
        </h1>
        <p className="mb-8 text-gray-600 text-lg">
          A decentralized trust and contribution platform.
        </p>
        <div className="flex flex-col gap-4">
          <Link href="/sign-up" className="w-full">
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-semibold transition"
            >
              Sign Up
            </button>
          </Link>
          <Link href="/sign-in" className="w-full">
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-200 text-blue-700 rounded-md hover:bg-gray-300 text-lg font-semibold transition"
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
