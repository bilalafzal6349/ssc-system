"use client";

import { useState, useEffect } from "react";
import { useApi } from "../../lib/api";
import TrustScore from "../../components/TrustScore";
import ContributionForm from "../../components/ContributionForm";
import CommunityList from "../../components/CommunityList";
import { TrustViewResponse, Contribution, UserProfile } from "../../lib/api";
import Navigation from "../../components/Navigation";

type User = { email: string; role: string } | null;

export default function Dashboard() {
  const { apiFetch } = useApi();

  const [trustData, setTrustData] = useState<TrustViewResponse | null>(null);
  const [contributions] = useState<Contribution[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom auth check
  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setError("You need to be authenticated to access the dashboard.");
        }
        setIsLoaded(true);
      })
      .catch(() => {
        setError("You need to be authenticated to access the dashboard.");
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line
  }, [isLoaded, user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Fetch trust data
      const trustResponse: TrustViewResponse = await apiFetch(
        "/api/trust/view"
      );
      setTrustData(trustResponse);
      // Fetch user profile
      const profileResponse = await apiFetch<{ user: UserProfile }>(
        "/api/user/profile"
      );
      setProfile(profileResponse.user);
      // Fetch contributions (you might need to implement this endpoint)
      // const contributionsResponse = await apiFetch("/api/contribution/status");
      // setContributions(contributionsResponse.contributions || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContributionSuccess = () => {
    // Refresh contributions list
    // fetchDashboardData();
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
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="User Dashboard" />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trust Score */}
            <div className="lg:col-span-1">
              <TrustScore trustData={trustData} isLoading={isLoading} />
            </div>
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Profile
                </h3>
                {profile ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        GitHub Handle
                      </label>
                      <p className="text-sm text-gray-900">
                        {profile.githubHandle || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Info
                      </label>
                      <p className="text-sm text-gray-900">
                        {profile.contactInfo || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <p className="text-sm text-gray-900 capitalize">
                        {profile.role || "user"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading profile...</p>
                )}
              </div>
            </div>
          </div>
          {/* Communities */}
          <div className="mt-6">
            <CommunityList />
          </div>
          {/* Contribution Form */}
          <div className="mt-6">
            <ContributionForm onSuccess={handleContributionSuccess} />
          </div>
          {/* Contributions List */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                My Contributions
              </h3>
              {contributions.length === 0 ? (
                <p className="text-gray-500">
                  No contributions yet. Submit your first contribution above!
                </p>
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
                          <div className="flex items-center space-x-2 mt-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                contribution.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : contribution.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {contribution.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {contribution.feedback && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-700">
                            {contribution.feedback.reason}
                          </p>
                          <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                            <span>
                              Quality:{" "}
                              {(contribution.feedback.quality * 100).toFixed(0)}
                              %
                            </span>
                            <span>
                              Compliance:{" "}
                              {(contribution.feedback.compliance * 100).toFixed(
                                0
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
