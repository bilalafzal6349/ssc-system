import { ReactNode } from "react";
import { useRole } from "../hooks/useRole";
import { RolePermissions } from "../roles";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: "user" | "maintainer" | "admin";
  requiredPermission?: keyof RolePermissions;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  requiredRole,
  requiredPermission,
  fallback = null,
}: RoleGuardProps) {
  const { role, hasPermissionTo, isLoaded } = useRole();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Check role requirement
  if (requiredRole) {
    const roleHierarchy = { user: 1, maintainer: 2, admin: 3 };
    const userLevel = roleHierarchy[role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return <>{fallback}</>;
    }
  }

  // Check permission requirement
  if (requiredPermission && !hasPermissionTo(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export function AdminOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRole="admin" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function MaintainerOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRole="maintainer" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function UserOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <RoleGuard requiredRole="user" fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
