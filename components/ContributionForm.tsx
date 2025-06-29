"use client";

import { useState } from "react";
import { useApi } from "../lib/api";
import { ContributionRequestBody } from "../lib/api";

interface ContributionFormProps {
  onSuccess?: () => void;
}

export default function ContributionForm({ onSuccess }: ContributionFormProps) {
  const { apiFetch } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ContributionRequestBody>({
    repositoryId: "",
    code: "",
    description: "",
  });

  // Mock repositories for demo purposes
  const mockRepositories = [
    { id: "repo1", name: "trust-system-backend" },
    { id: "repo2", name: "security-framework" },
    { id: "repo3", name: "blockchain-integration" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await apiFetch("/api/contribution/submit", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess(true);
      setFormData({ repositoryId: "", code: "", description: "" });
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    field: keyof ContributionRequestBody,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Submit Contribution
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Contribution submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="repository"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Repository
          </label>
          <select
            id="repository"
            value={formData.repositoryId}
            onChange={(e) => handleChange("repositoryId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a repository</option>
            {mockRepositories.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your contribution..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Code
          </label>
          <textarea
            id="code"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Paste your code here..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Contribution"}
          </button>
        </div>
      </form>
    </div>
  );
}
