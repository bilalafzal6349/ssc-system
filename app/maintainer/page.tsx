"use client";

import { useState, useEffect } from "react";
import { useApi } from "../../lib/api";
import { MaintainerOnly } from "../../lib/components/RoleGuard";
import Navigation from "../../components/Navigation";
import {
  ValidateRequestBody,
  FlagRequestBody,
  VoteRequestBody,
  Contribution,
} from "../../lib/api";

export default function MaintainerDashboard() {
  const { apiFetch } = useApi();

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [validateForm, setValidateForm] = useState<ValidateRequestBody>({
    contributionId: "",
    status: "approved",
    feedback: {
      quality: 0.8,
      compliance: 0.8,
      reason: "",
    },
  });

  const [flagForm, setFlagForm] = useState<FlagRequestBody>({
    contributionId: "",
    reason: "",
  });

  const [voteForm, setVoteForm] = useState<VoteRequestBody>({
    userId: "",
    vote: "approve",
    reason: "",
  });

  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          window.location.href = "/login";
        }
        setIsLoaded(true);
      })
      .catch(() => {
        window.location.href = "/login";
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchContributions();
    }
  }, [isLoaded, user]);

  const fetchContributions = async () => {
    try {
      setIsLoading(true);
      // Mock data for demo - replace with actual API call
      const mockContributions: Contribution[] = [
        {
          _id: "1",
          user: "user1",
          repository: "trust-system-backend",
          mergeRequestId: "mr1",
          status: "pending",
          description: "Add new authentication endpoint",
        },
        {
          _id: "2",
          user: "user2",
          repository: "security-framework",
          mergeRequestId: "mr2",
          status: "pending",
          description: "Implement role-based access control",
        },
      ];
      setContributions(mockContributions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/api/contribution/validate", {
        method: "POST",
        body: JSON.stringify(validateForm),
      });
      alert("Contribution validated successfully!");
      setValidateForm({
        contributionId: "",
        status: "approved",
        feedback: { quality: 0.8, compliance: 0.8, reason: "" },
      });
      fetchContributions();
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  const handleFlagContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/api/alert/flag", {
        method: "POST",
        body: JSON.stringify(flagForm),
      });
      alert("Contribution flagged successfully!");
      setFlagForm({ contributionId: "", reason: "" });
      fetchContributions();
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/api/alert/vote", {
        method: "POST",
        body: JSON.stringify(voteForm),
      });
      alert("Vote submitted successfully!");
      setVoteForm({ userId: "", vote: "approve", reason: "" });
    } catch (err) {
      alert(`Error: ${(err as Error).message}`);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in</h1>
          <p className="text-gray-600 mt-2">
            You need to be authenticated to access the maintainer dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MaintainerOnly>
      <div className="min-h-screen bg-gray-50">
        <Navigation title="Maintainer Dashboard" />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Pending Contributions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pending Contributions
              </h3>

              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : contributions.length === 0 ? (
                <p className="text-gray-500">No pending contributions.</p>
              ) : (
                <div className="space-y-4">
                  {contributions.map((contribution) => (
                    <div
                      key={contribution._id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {contribution.description}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Repository: {contribution.repository}
                          </p>
                          <p className="text-sm text-gray-500">
                            User: {contribution.user}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              {contribution.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setValidateForm((prev) => ({
                                ...prev,
                                contributionId: contribution._id,
                              }))
                            }
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Validate
                          </button>
                          <button
                            onClick={() =>
                              setFlagForm((prev) => ({
                                ...prev,
                                contributionId: contribution._id,
                              }))
                            }
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Flag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Validate Contribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Validate Contribution
                </h3>
                <form
                  onSubmit={handleValidateContribution}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contribution ID
                    </label>
                    <input
                      type="text"
                      value={validateForm.contributionId}
                      onChange={(e) =>
                        setValidateForm((prev) => ({
                          ...prev,
                          contributionId: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={validateForm.status}
                      onChange={(e) =>
                        setValidateForm((prev) => ({
                          ...prev,
                          status: e.target.value as "approved" | "rejected",
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quality (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={validateForm.feedback.quality}
                        onChange={(e) =>
                          setValidateForm((prev) => ({
                            ...prev,
                            feedback: {
                              ...prev.feedback,
                              quality: parseFloat(e.target.value),
                            },
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Compliance (0-1)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={validateForm.feedback.compliance}
                        onChange={(e) =>
                          setValidateForm((prev) => ({
                            ...prev,
                            feedback: {
                              ...prev.feedback,
                              compliance: parseFloat(e.target.value),
                            },
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Feedback
                    </label>
                    <textarea
                      value={validateForm.feedback.reason}
                      onChange={(e) =>
                        setValidateForm((prev) => ({
                          ...prev,
                          feedback: {
                            ...prev.feedback,
                            reason: e.target.value,
                          },
                        }))
                      }
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Validate
                  </button>
                </form>
              </div>

              {/* Flag Contribution */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Flag Contribution
                </h3>
                <form onSubmit={handleFlagContribution} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contribution ID
                    </label>
                    <input
                      type="text"
                      value={flagForm.contributionId}
                      onChange={(e) =>
                        setFlagForm((prev) => ({
                          ...prev,
                          contributionId: e.target.value,
                        }))
                      }
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reason
                    </label>
                    <textarea
                      value={flagForm.reason}
                      onChange={(e) =>
                        setFlagForm((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Explain why this contribution should be flagged..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    Flag Contribution
                  </button>
                </form>
              </div>
            </div>

            {/* Vote on Malicious Entities */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Vote on Malicious Entities
              </h3>
              <form onSubmit={handleVote} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={voteForm.userId}
                    onChange={(e) =>
                      setVoteForm((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vote
                  </label>
                  <select
                    value={voteForm.vote}
                    onChange={(e) =>
                      setVoteForm((prev) => ({
                        ...prev,
                        vote: e.target.value as "approve" | "reject",
                      }))
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reason
                  </label>
                  <textarea
                    value={voteForm.reason}
                    onChange={(e) =>
                      setVoteForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Submit Vote
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </MaintainerOnly>
  );
}
