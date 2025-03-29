# Career Kit Directory Structure Explanation

The Career Kit project follows a modern Next.js application structure with the App Router pattern. Here's a detailed breakdown of how the project is organized:

## Top-Level Structure

```
career-kit/
├── public/                 # Static assets (images, fonts, etc.)
├── src/                    # Source code
├── .env.local              # Environment variables (not committed to git)
├── next.config.js          # Next.js configuration 
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Source Code (src)

The src directory contains all the application code, organized as follows:

### App Directory (app)

This uses Next.js 13+ App Router pattern:

```
src/app/
├── (auth)/                 # Authentication routes (login, register, etc.)
│   ├── auth/               # Auth pages
│   │   ├── login/
│   │   ├── register/
│   │   └── ...
├── (community)/            # Community forum routes
│   ├── community/          # Community pages
│   │   ├── page.tsx        # Main community page (forum listing)
│   │   ├── post/           # Post-related pages
│   │   │   ├── [id]/       # Dynamic route for individual posts
│   │   │   └── create/     # Create new post page
│   │   └── edit/           # Edit post page
├── api/                    # API route handlers (backend)
│   ├── auth/               # Authentication API routes
│   │   ├── login/
│   │   ├── register/
│   │   └── user/
│   ├── post/               # Post-related API endpoints
│   │   ├── all/
│   │   ├── one/
│   │   ├── create/
│   │   ├── edit/
│   │   └── like/
│   ├── comment/            # Comment-related API endpoints
│   └── ...
├── page.tsx                # Home page
├── layout.tsx              # Root layout
└── ...                     # Other feature routes (resume, jobs, etc.)
```

### Components (components)

Reusable UI components:

```
src/components/
├── shared/                 # Shared components used across features
│   ├── PostCard.tsx        # Card component for forum posts
│   ├── CommentList.tsx     # List of comments
│   ├── CommentForm.tsx     # Form for creating/editing comments
│   └── ...
├── ui/                     # Shadcn UI components (buttons, cards, etc.)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   └── ...
└── ...                     # Feature-specific components
```

### Utility Functions (lib)

Helper functions and configurations:

```
src/lib/
├── auth.ts                 # Authentication configuration
├── db.ts                   # Database connection logic
├── utils.ts                # General utility functions
└── ...                     # Other utilities
```

### Type Definitions (`src/types/`)

TypeScript interfaces and types:

```
src/types/
├── post.ts                 # Post-related types
├── user.ts                 # User-related types
├── comment.ts              # Comment-related types
└── ...                     # Other type definitions
```

## Key Architectural Points

1. **Route Groups**: Parentheses in folder names like `(auth)` and `(community)` are Next.js route groups that organize related routes without affecting the URL structure.

2. **API Routes**: The `api` directory contains all backend functionality, structured to mirror the frontend routes.

3. **Component Organization**: Components are divided between shared (used across features) and UI (basic building blocks).

4. **Dynamic Routes**: Square brackets in folder names like `[id]` indicate dynamic routes where the parameter changes (e.g., individual post pages).

5. **Library Code**: The `lib` directory contains reusable code that isn't React components but provides functionality to the application.

This structure follows modern Next.js best practices with a clear separation of concerns between the frontend UI, backend API routes, and shared utilities.