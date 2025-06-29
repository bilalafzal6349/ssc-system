# Trust System Frontend

A Next.js frontend with TypeScript and Clerk role-based authentication for the Software Supply Chain (SSC) security system.

## Features

- **Role-based Authentication**: Supports `user`, `admin`, and `maintainer` roles
- **User Dashboard**: Trust score display, contribution submission, community management
- **Admin Panel**: Trust initialization, penalty application, blockchain logs, user management
- **Maintainer Dashboard**: Contribution validation, flagging, voting on malicious entities
- **Responsive Design**: Modern UI with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Prerequisites

- Node.js 18+
- npm or yarn
- Clerk account for authentication
- Backend API running (see backend setup)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Clerk Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Clerk Configuration

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Configure OAuth providers (Google, GitHub) in the Clerk dashboard
4. Copy your publishable key and secret key to the environment variables
5. Set up role-based access by configuring user metadata

### 4. Role Setup in Clerk

In your Clerk dashboard, configure user metadata to include roles:

```json
{
  "role": "user" // or "admin" or "maintainer"
}
```

You can set this via the Clerk dashboard or programmatically when users sign up.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the application.

## Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── sign-in/           # Sign-in page
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   ├── maintainer/        # Maintainer dashboard
│   ├── layout.tsx         # Root layout with Clerk provider
│   └── page.tsx           # Home page with role-based redirects
├── components/            # Reusable components
│   ├── TrustScore.tsx     # Trust score display component
│   ├── ContributionForm.tsx # Contribution submission form
│   ├── CommunityList.tsx  # Community management component
│   └── Navigation.tsx     # Navigation header component
├── lib/                   # Utility libraries
│   ├── api.ts            # API client and type definitions
│   ├── hooks/            # Custom React hooks
│   │   └── useRole.ts    # Role management hook
│   └── components/       # Role-based components
│       └── RoleGuard.tsx # Role protection components
├── middleware.ts         # Clerk authentication middleware
└── roles.ts             # Role and permission definitions
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication

- `GET /api/auth/verify` - Verify user authentication

### Trust Management

- `GET /api/trust/view` - View user trust score
- `POST /api/trust/initialize` - Initialize trust score (admin only)
- `POST /api/trust/update` - Update trust score

### Contributions

- `POST /api/contribution/submit` - Submit new contribution
- `POST /api/contribution/validate` - Validate contribution (maintainer/admin)
- `GET /api/contribution/status` - Get contribution status

### Communities

- `GET /api/community/list` - List available communities
- `POST /api/community/join` - Join a community

### User Management

- `GET /api/user/profile` - Get user profile
- `POST /api/user/role` - Update user role (admin only)

### Admin Functions

- `POST /api/penalty/apply` - Apply penalty to user
- `GET /api/blockchain/log` - View blockchain logs

### Alert System

- `POST /api/alert/flag` - Flag suspicious contribution
- `POST /api/alert/vote` - Vote on malicious entities

## Role-Based Access Control

### User Role

- View trust score and history
- Submit contributions
- Join communities
- View own contributions

### Maintainer Role

- All user permissions
- Validate contributions
- Flag suspicious contributions
- Vote on malicious entities

### Admin Role

- All maintainer permissions
- Initialize trust scores
- Apply penalties
- View blockchain logs
- Manage user roles

## Components

### TrustScore

Displays user trust score with visual indicators and history.

### ContributionForm

Form for submitting new contributions with repository selection.

### CommunityList

Lists available communities with join functionality.

### Navigation

Header component with role-based navigation and sign-out functionality.

### RoleGuard Components

- `RoleGuard` - Protect content based on role or permission
- `AdminOnly` - Show content only to admins
- `MaintainerOnly` - Show content only to maintainers and admins

## Styling

The application uses Tailwind CSS for styling. The design is responsive and follows modern UI/UX principles.

## Development

### Adding New Components

1. Create the component in the `components/` directory
2. Use TypeScript for type safety
3. Follow the existing component patterns
4. Add proper error handling and loading states

### Adding New API Endpoints

1. Add type definitions in `lib/api.ts`
2. Create API utility functions
3. Update components to use the new endpoints
4. Add proper error handling

### Role Management

1. Update `roles.ts` to define new roles/permissions
2. Update `RoleGuard` components if needed
3. Configure Clerk metadata accordingly

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables
3. Deploy the `out/` directory

## Troubleshooting

### Common Issues

1. **Clerk Authentication Errors**

   - Verify environment variables are set correctly
   - Check Clerk dashboard configuration
   - Ensure OAuth providers are properly configured

2. **API Connection Issues**

   - Verify backend is running
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Ensure CORS is configured on backend

3. **Role-Based Access Issues**
   - Verify user metadata in Clerk dashboard
   - Check role definitions in `roles.ts`
   - Ensure proper role guards are in place

### Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
