// lib/roles.ts
export type UserRole = "user" | "maintainer" | "admin";

export interface RolePermissions {
  canSubmitContributions: boolean;
  canValidateContributions: boolean;
  canFlagContributions: boolean;
  canVoteOnAlerts: boolean;
  canApplyPenalties: boolean;
  canInitializeTrust: boolean;
  canViewBlockchainLogs: boolean;
  canManageUsers: boolean;
  canJoinCommunities: boolean;
  canViewAllCommunities: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  user: {
    canSubmitContributions: true,
    canValidateContributions: false,
    canFlagContributions: false,
    canVoteOnAlerts: false,
    canApplyPenalties: false,
    canInitializeTrust: false,
    canViewBlockchainLogs: false,
    canManageUsers: false,
    canJoinCommunities: true,
    canViewAllCommunities: false,
  },
  maintainer: {
    canSubmitContributions: true,
    canValidateContributions: true,
    canFlagContributions: true,
    canVoteOnAlerts: true,
    canApplyPenalties: false,
    canInitializeTrust: false,
    canViewBlockchainLogs: false,
    canManageUsers: false,
    canJoinCommunities: true,
    canViewAllCommunities: true,
  },
  admin: {
    canSubmitContributions: true,
    canValidateContributions: true,
    canFlagContributions: true,
    canVoteOnAlerts: true,
    canApplyPenalties: true,
    canInitializeTrust: true,
    canViewBlockchainLogs: true,
    canManageUsers: true,
    canJoinCommunities: true,
    canViewAllCommunities: true,
  },
};

export function hasPermission(
  userRole: UserRole,
  permission: keyof RolePermissions
): boolean {
  return ROLE_PERMISSIONS[userRole]?.[permission] || false;
}

export function getRolePermissions(userRole: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.user;
}

export function isValidRole(role: string): role is UserRole {
  return Object.keys(ROLE_PERMISSIONS).includes(role);
}
