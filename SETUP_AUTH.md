# 🔐 Authentication Setup Guide

## Prerequisites

You need a Supabase account and project. If you don't have one:
1. Go to https://supabase.com
2. Create a free account
3. Create a new project

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Create Environment File

Create a `.env` file in the project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# App Configuration
VITE_GUEST_SESSION_MINUTES=90
```

⚠️ **Important**: Never commit `.env` to git! It's already in `.gitignore`.

## Step 3: Set Up Supabase Database

Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor):

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  user_name text unique not null,
  email text not null,
  role text default 'user' check (role in ('user', 'host', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create rooms table
create table rooms (
  id text primary key,
  platform text not null check (platform in ('youtube', 'twitch', 'hosted', 'local')),
  url text not null,
  host_name text not null,
  host_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true,
  participant_count integer default 0
);

-- Create participants table
create table participants (
  id uuid default uuid_generate_v4() primary key,
  room_id text references rooms on delete cascade not null,
  user_name text not null,
  user_id text not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_host boolean default false,
  is_online boolean default true
);

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  room_id text references rooms on delete cascade not null,
  user_name text not null,
  user_id text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_system boolean default false
);

-- Create video_states table
create table video_states (
  room_id text references rooms on delete cascade primary key,
  playing boolean default false,
  current_time real default 0,
  duration real default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table participants enable row level security;
alter table messages enable row level security;
alter table video_states enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Rooms policies
create policy "Rooms are viewable by everyone"
  on rooms for select
  using ( true );

create policy "Authenticated users can create rooms"
  on rooms for insert
  with check ( auth.uid() is not null );

create policy "Room hosts can update their rooms"
  on rooms for update
  using ( auth.uid() = host_id );

create policy "Room hosts can delete their rooms"
  on rooms for delete
  using ( auth.uid() = host_id );

-- Participants policies
create policy "Participants are viewable by everyone"
  on participants for select
  using ( true );

create policy "Anyone can join rooms"
  on participants for insert
  with check ( true );

create policy "Participants can update their status"
  on participants for update
  using ( true );

create policy "Participants can leave rooms"
  on participants for delete
  using ( true );

-- Messages policies
create policy "Messages are viewable by everyone"
  on messages for select
  using ( true );

create policy "Anyone can send messages"
  on messages for insert
  with check ( true );

-- Video states policies
create policy "Video states are viewable by everyone"
  on video_states for select
  using ( true );

create policy "Room hosts can update video state"
  on video_states for insert
  with check ( true );

create policy "Room hosts can update video state"
  on video_states for update
  using ( true );
```

## Step 4: Test the Setup

1. Restart your dev server:
```bash
npm run dev
```

2. Open http://localhost:3000
3. You should see the authentication modal
4. Try:
   - ✅ Continue as Guest (90 minutes free)
   - ✅ Create Account
   - ✅ Sign In

## Features

### ✅ Guest Mode
- 90 minutes of free access
- No account required
- Timer shows remaining time
- Can upgrade anytime

### ✅ User Accounts
- Email/password authentication
- Unlimited watch party hosting
- Profile management
- No time limits

### ✅ Security
- Row Level Security (RLS) enabled
- Secure authentication with Supabase
- Session management
- Auto token refresh

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists
- Check that variable names start with `VITE_`
- Restart dev server after creating `.env`

### "Failed to create profile"
- Make sure you ran the SQL setup script
- Check Supabase project is active
- Verify database tables exist

### Guest timer not showing
- Check browser console for errors
- Verify `VITE_GUEST_SESSION_MINUTES` is set
- Clear browser localStorage and try again

## Next Steps

Once authentication is working:
1. Add real-time video synchronization
2. Implement chat system
3. Add premium themes
4. Integrate Stripe for subscriptions

