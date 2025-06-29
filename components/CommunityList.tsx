"use client";

import { useState, useEffect } from "react";
import { useApi } from "../lib/api";
import { Community, CommunityResponse, JoinRequestBody } from "../lib/api";

export default function CommunityList() {
  const { apiFetch } = useApi();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningCommunity, setJoiningCommunity] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setIsLoading(true);
      const response: CommunityResponse = await apiFetch("/api/community/list");
      if (response.communities) {
        setCommunities(response.communities);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      setJoiningCommunity(communityId);
      const joinData: JoinRequestBody = { communityId };

      await apiFetch("/api/community/join", {
        method: "POST",
        body: JSON.stringify(joinData),
      });

      // Refresh communities list
      await fetchCommunities();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setJoiningCommunity(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Communities</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Communities</h3>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Communities</h3>

      {communities.length === 0 ? (
        <p className="text-gray-500">No communities available.</p>
      ) : (
        <div className="space-y-4">
          {communities.map((community) => (
            <div key={community._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {community.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        community.type === "public"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {community.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {community.members.length} members
                    </span>
                  </div>
                </div>

                {community.type === "public" && (
                  <button
                    onClick={() => handleJoinCommunity(community._id)}
                    disabled={joiningCommunity === community._id}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {joiningCommunity === community._id ? "Joining..." : "Join"}
                  </button>
                )}

                {community.type === "private" && (
                  <span className="text-sm text-gray-500">
                    Request required
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
