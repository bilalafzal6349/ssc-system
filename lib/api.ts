import { useAuth } from "@clerk/nextjs";

// API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// Generic API fetch function
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Hook for making authenticated API calls
export function useApi() {
  const { getToken } = useAuth();

  const authenticatedFetch = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const token = await getToken();

    return apiFetch<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return { apiFetch: authenticatedFetch };
}

// API Response Types
export interface TrustViewResponse {
  trustScore?: number;
  history?: TrustHistoryItem[];
  error?: string;
}

export interface TrustHistoryItem {
  score: number;
  reason: string;
  createdAt: string;
}

export interface CommunityResponse {
  communities?: Community[];
  error?: string;
}

export interface Community {
  _id: string;
  name: string;
  type: "public" | "private";
  members: string[];
  joinRequests: JoinRequest[];
}

export interface JoinRequest {
  userId: string;
  credentials?: {
    preTrust: number;
    legalAgreements: number;
    communityType: number;
    capabilities: number;
  };
}

export interface ContributionResponse {
  contribution?: Contribution;
  transaction?: unknown;
  error?: string;
}

export interface Contribution {
  _id: string;
  user: string;
  repository: string;
  mergeRequestId: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  feedback?: {
    quality: number;
    compliance: number;
    reason?: string;
  };
  flags?: Flag[];
}

export interface Flag {
  reason: string;
  flaggedBy: string;
}

export interface UserProfile {
  _id: string;
  githubHandle?: string;
  contactInfo?: string;
  role?: string;
  trustScore?: number;
}

export interface BlockchainLogResponse {
  logs?: unknown[];
  error?: string;
}

export interface PenaltyResponse {
  trustScore?: number;
  transaction?: unknown;
  error?: string;
}

export interface AlertResponse {
  contribution?: unknown;
  transaction?: unknown;
  error?: string;
}

// API Request Types
export interface JoinRequestBody {
  communityId: string;
  credentials?: {
    preTrust: number;
    legalAgreements: number;
    communityType: number;
    capabilities: number;
  };
}

export interface ContributionRequestBody {
  repositoryId: string;
  code: string;
  description: string;
}

export interface ValidateRequestBody {
  contributionId: string;
  status: "approved" | "rejected";
  feedback: {
    quality: number;
    compliance: number;
    reason?: string;
  };
}

export interface InitializeRequestBody {
  userId: string;
  preTrust: number;
  legalAgreements: number;
  communityType: number;
  capabilities: number;
}

export interface PenaltyRequestBody {
  userId: string;
  penalty: number;
  reason: string;
}

export interface FlagRequestBody {
  contributionId: string;
  reason: string;
}

export interface VoteRequestBody {
  userId: string;
  vote: "approve" | "reject";
  reason: string;
}

export interface ProfileRequestBody {
  githubHandle?: string;
  contactInfo?: string;
  role?: "user" | "admin" | "maintainer";
}

export interface RoleRequestBody {
  userId: string;
  role: string;
}
