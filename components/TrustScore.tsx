"use client";

import { useState } from "react";
import { TrustViewResponse, TrustHistoryItem } from "../lib/api";

interface TrustScoreProps {
  trustData: TrustViewResponse | null;
  isLoading?: boolean;
}

export default function TrustScore({ trustData, isLoading }: TrustScoreProps) {
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!trustData || trustData.error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Trust Score</h3>
        <div className="text-red-600">
          {trustData?.error || "Failed to load trust score"}
        </div>
      </div>
    );
  }

  const trustScore = trustData.trustScore || 0;
  const history = trustData.history || [];

  const getTrustColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-100";
    if (score >= 0.6) return "text-yellow-600 bg-yellow-100";
    if (score >= 0.4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getTrustLevel = (score: number) => {
    if (score >= 0.8) return "Excellent";
    if (score >= 0.6) return "Good";
    if (score >= 0.4) return "Fair";
    return "Poor";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Trust Score</h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div
            className={`text-3xl font-bold px-4 py-2 rounded-lg ${getTrustColor(
              trustScore
            )}`}
          >
            {(trustScore * 100).toFixed(1)}%
          </div>
          <div>
            <div className="text-sm text-gray-500">Trust Level</div>
            <div className="font-medium">{getTrustLevel(trustScore)}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                trustScore >= 0.8
                  ? "bg-green-500"
                  : trustScore >= 0.6
                  ? "bg-yellow-500"
                  : trustScore >= 0.4
                  ? "bg-orange-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${trustScore * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {showHistory && history.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Trust History
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {history.map((item: TrustHistoryItem, index: number) => (
              <div
                key={index}
                className="flex justify-between items-start p-3 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {(item.score * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">{item.reason}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHistory && history.length === 0 && (
        <div className="border-t pt-4">
          <p className="text-gray-500 text-sm">No trust history available.</p>
        </div>
      )}
    </div>
  );
}
