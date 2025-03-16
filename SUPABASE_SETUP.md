# Supabase Setup Guide for Joytask

This guide will walk you through setting up Supabase for your Joytask application, including database configuration and Google authentication.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Create a new project by clicking "New Project".
3. Enter a name for your project and set a secure database password.
4. Choose a region closest to your users.
5. Wait for your project to be created (this may take a few minutes).

## 2. Set Up Database Tables

You can set up the database tables in two ways:

### Option 1: Using the SQL Editor

1. In your Supabase dashboard, go to the "SQL Editor" section.
2. Copy the contents of the `supabase/schema.sql` file from this repository.
3. Paste the SQL into the editor and click "Run".

### Option 2: Using the Table Editor

1. In your Supabase dashboard, go to the "Table Editor" section.
2. Create the following tables with their respective columns:

#### Tasks Table

- `id` (UUID, Primary Key, Default: `uuid_generate_v4()`)
- `title` (Text, Not Null)
- `completed` (Boolean, Not Null, Default: false)
- `created_at` (Timestamp with Time Zone, Not Null, Default: NOW())
- `completed_at` (Timestamp with Time Zone, Nullable)
- `deadline` (Timestamp with Time Zone, Nullable)
- `date` (Text, Not Null)
- `user_id` (UUID, Not Null, Foreign Key to auth.users.id)

#### Profiles Table

- `id` (UUID, Primary Key, Foreign Key to auth.users.id)
- `updated_at` (Timestamp with Time Zone, Nullable)
- `username` (Text, Unique, Nullable)
- `full_name` (Text, Nullable)
- `avatar_url` (Text, Nullable)

## 3. Set Up Row Level Security (RLS)

1. In your Supabase dashboard, go to the "Authentication" > "Policies" section.
2. For the `tasks` table, add the following policies:
   - "Users can view their own tasks" (SELECT): `auth.uid() = user_id`
   - "Users can insert their own tasks" (INSERT): `auth.uid() = user_id`
   - "Users can update their own tasks" (UPDATE): `auth.uid() = user_id`
   - "Users can delete their own tasks" (DELETE): `auth.uid() = user_id`
3. For the `profiles` table, add the following policies:
   - "Profiles are viewable by everyone" (SELECT): `true`
   - "Users can update their own profile" (UPDATE): `auth.uid() = id`

## 4. Set Up Google Authentication

### 4.1 Create a Google OAuth Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "Credentials".
4. Click "Create Credentials" and select "OAuth client ID".
5. Configure the OAuth consent screen if prompted.
6. For "Application type", select "Web application".
7. Add the following authorized redirect URIs:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
8. Click "Create" and note down your Client ID and Client Secret.

### 4.2 Configure Supabase Auth

1. In your Supabase dashboard, go to the "Authentication" > "Providers" section.
2. Find "Google" in the list and click "Edit".
3. Toggle the "Enabled" switch to on.
4. Enter your Google Client ID and Client Secret.
5. Save the changes.

## 5. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local` in your project.
2. Update the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (found in the Supabase dashboard under "Settings" > "API")
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key (found in the same place)

## 6. Test Your Setup

1. Start your Next.js development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click the "Sign In with Google" button
4. You should be redirected to Google's authentication page
5. After signing in, you should be redirected back to your application and be authenticated

## Troubleshooting

### Authentication Issues

- Make sure your redirect URIs are correctly configured in both Google Cloud Console and Supabase.
- Check that your Client ID and Client Secret are correctly entered in Supabase.
- Ensure that your environment variables are correctly set.

### Database Issues

- Check that your tables are created with the correct columns and constraints.
- Ensure that Row Level Security (RLS) policies are correctly configured.
- Verify that the trigger for creating profiles on user signup is working.

### API Issues

- Check the browser console for any errors.
- Verify that your Supabase URL and anon key are correctly set in your environment variables.
- Ensure that your API calls are correctly formatted.
