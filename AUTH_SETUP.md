# TiffinXpress - Authentication Setup Guide

## Overview

Your authentication system is now fully integrated with **Supabase**. Users can sign up, log in, and manage their profiles.

## Features Implemented

### ✅ Authentication Pages

- **Login Page** (`/login`) - Beautiful login form with email/password
- **Signup Page** (`/signup`) - Full registration with validation
- Both pages match your app's orange & cream theme

### ✅ Features

- Email/Password authentication via Supabase
- Form validation with error handling
- Password visibility toggle
- Remember me checkbox
- Social login buttons (UI ready - add Google OAuth later)
- Responsive design (mobile-friendly)
- Smooth animations and transitions

### ✅ User Features

- User profile dropdown in header
- Logout functionality
- User avatar with initials
- Dynamic header (shows Login/Signup when logged out)
- Auth state management with React Context

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Choose a name and password
5. Wait for the project to be initialized

### 2. Get Your Credentials

1. In your Supabase project, go to **Settings → API**
2. Copy your:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 3. Create Environment File

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key...
```

### 4. Enable Authentication in Supabase

1. Go to **Authentication → Providers**
2. Enable **Email** (enabled by default)
3. Optional: Set up Google OAuth
   - Get credentials from Google Cloud Console
   - Add them in Supabase → Authentication → Providers

### 5. Create Auth Schema (Optional)

If you want to store additional user data, create a profiles table:

```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text,
  avatar_url text,
  phone text,
  address text,
  city text,
  created_at timestamp DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
```

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Auth state management
├── pages/
│   └── auth/
│       ├── Login.jsx             # Login page
│       ├── Signup.jsx            # Signup page
│       └── Auth.css              # Auth styling
├── utils/
│   └── supabaseClient.js         # Supabase initialization
├── App.jsx                       # Updated with auth routes
├── main.jsx                      # Updated with AuthProvider
└── component/
    └── Header.jsx                # Updated with user menu
```

## Usage Examples

### Using Auth in Components

```jsx
import { useAuth } from "../context/AuthContext";

export function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

### Protected Routes (Coming Soon)

You can add route protection:

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}
```

## Styling Theme

- **Primary Color**: `#ff7a00` (Orange)
- **Background**: `#ffffff` (White)
- **Accent**: `#1f7a8c` (Teal)
- **Muted Background**: `#f7f7f7` (Light Gray)

## Next Steps

1. **Test the flow**:

   - Click "Get Started" → fills signup form
   - Create an account and check email
   - Log in with your credentials
   - Try logout from user menu

2. **Add Google OAuth**:

   - Set up in Supabase Authentication
   - Update button handlers in Login/Signup

3. **Add Profile Pages**:

   - Create profile edit page
   - Add order history
   - Add settings page

4. **Email Verification**:

   - Set up email templates in Supabase
   - Add verification email flow

5. **Add Password Reset**:
   - Create forgot password page
   - Add password reset email template

## Troubleshooting

### "Cannot find module @supabase/supabase-js"

```bash
npm install @supabase/supabase-js
```

### Auth not persisting

- Check if `.env.local` has correct credentials
- Check browser console for Supabase errors
- Verify Row Level Security settings in Supabase

### Login page shows loading forever

- Check Supabase URL and key in `.env.local`
- Check browser console for CORS errors
- Verify Supabase project is running

## Support

For issues:

1. Check [Supabase Docs](https://supabase.com/docs)
2. Check browser console (F12)
3. Check Supabase dashboard for errors
