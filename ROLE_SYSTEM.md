# Role-Based Access Control System

This document explains the role-based access control (RBAC) system implemented using Clerk authentication.

## 🎯 Overview

The system implements three distinct roles with hierarchical permissions:

- **User** (Base level)
- **Maintainer** (Mid level)
- **Admin** (Highest level)

## 🔐 Roles and Permissions

### User Role

- ✅ Submit contributions
- ✅ Join communities
- ❌ Validate contributions
- ❌ Flag contributions
- ❌ Vote on alerts
- ❌ Apply penalties
- ❌ Initialize trust
- ❌ View blockchain logs
- ❌ Manage users
- ❌ View all communities

### Maintainer Role

- ✅ Submit contributions
- ✅ Join communities
- ✅ Validate contributions
- ✅ Flag contributions
- ✅ Vote on alerts
- ✅ View all communities
- ❌ Apply penalties
- ❌ Initialize trust
- ❌ View blockchain logs
- ❌ Manage users

### Admin Role

- ✅ All permissions
- ✅ Submit contributions
- ✅ Join communities
- ✅ Validate contributions
- ✅ Flag contributions
- ✅ Vote on alerts
- ✅ Apply penalties
- ✅ Initialize trust
- ✅ View blockchain logs
- ✅ Manage users
- ✅ View all communities

## 🏗️ Architecture

### 1. Role Management (`lib/roles.ts`)

- Defines role types and permissions
- Provides utility functions for permission checking
- Centralized permission configuration

### 2. React Hook (`lib/hooks/useRole.ts`)

- Provides role and permission data to components
- Integrates with Clerk user data
- Caches role information for performance

### 3. Role Guards (`lib/components/RoleGuard.tsx`)

- Conditional rendering based on roles/permissions
- Convenience components for common role checks
- Fallback content for unauthorized users

### 4. API Middleware (`backend/middleware/auth.ts`)

- Server-side role validation
- Request augmentation with user role data
- Permission-based route protection

## 🚀 Usage Examples

### Frontend Components

```tsx
import { RoleGuard, AdminOnly, MaintainerOnly } from '../lib/components/RoleGuard';

// Role-based rendering
<RoleGuard requiredRole="admin">
  <AdminPanel />
</RoleGuard>

// Permission-based rendering
<RoleGuard requiredPermission="canValidateContributions">
  <ValidationForm />
</RoleGuard>

// Convenience components
<AdminOnly>
  <UserManagement />
</AdminOnly>

<MaintainerOnly>
  <ContributionReview />
</MaintainerOnly>
```

### React Hook

```tsx
import { useRole } from "../lib/hooks/useRole";

function MyComponent() {
  const { role, permissions, hasPermissionTo, isAdmin } = useRole();

  if (hasPermissionTo("canValidateContributions")) {
    // Show validation UI
  }
}
```

### API Endpoints

```tsx
// Role-based API protection
export default withRole(["admin", "maintainer"], async function handler(req) {
  // Only admins and maintainers can access
});

// Permission-based API protection
export default withAuth(async function handler(req) {
  // All authenticated users can access
});
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Clerk Dashboard Setup

1. Create a Clerk application
2. Configure authentication methods
3. Set up user metadata for roles
4. Configure webhooks if needed

### 3. Role Assignment

Roles are stored in Clerk's `publicMetadata.role` field:

- `"user"` - Default role
- `"maintainer"` - Mid-level permissions
- `"admin"` - Full permissions

### 4. API Endpoints

The system includes role management endpoints:

- `POST /api/user/role` - Update user role (admin only)

## 🛡️ Security Features

1. **Server-side validation** - All API endpoints validate roles
2. **Client-side guards** - UI components respect permissions
3. **Role hierarchy** - Higher roles inherit lower role permissions
4. **Permission granularity** - Fine-grained control over actions
5. **Clerk integration** - Secure authentication and user management

## 📝 API Endpoints by Role

### User Endpoints

- `GET /api/user/profile` - View profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/token` - Get JWT token

### Maintainer Endpoints

- `POST /api/contribution/validate` - Validate contributions
- `POST /api/alert/flag` - Flag contributions
- `POST /api/alert/vote` - Vote on alerts

### Admin Endpoints

- `POST /api/penalty/apply` - Apply penalties
- `POST /api/trust/initialize` - Initialize trust scores
- `GET /api/blockchain/log` - View blockchain logs
- `POST /api/user/role` - Manage user roles

## 🔄 Role Hierarchy

```
Admin (Level 3)
├── All Maintainer permissions
└── All User permissions

Maintainer (Level 2)
├── All User permissions
└── Additional maintainer permissions

User (Level 1)
└── Base user permissions
```

## 🧪 Testing

### Test Different Roles

1. Create test users in Clerk dashboard
2. Assign different roles via `publicMetadata.role`
3. Test UI visibility and API access
4. Verify permission inheritance

### API Testing

```bash
# Test with different roles
curl -H "Authorization: Bearer <token>" \
     -X GET http://localhost:3000/api/user/profile

curl -H "Authorization: Bearer <admin_token>" \
     -X POST http://localhost:3000/api/user/role \
     -H "Content-Type: application/json" \
     -d '{"userId": "user_id", "role": "maintainer"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **Role not updating** - Check Clerk dashboard metadata
2. **Permissions not working** - Verify role assignment
3. **API 403 errors** - Check role requirements
4. **UI not showing** - Verify RoleGuard usage

### Debug Commands

```tsx
// Check current role
console.log(useRole().role);

// Check specific permission
console.log(useRole().hasPermissionTo("canValidateContributions"));

// List all permissions
console.log(useRole().permissions);
```

This role-based access system provides a secure, scalable foundation for managing user permissions in your trust system application.
