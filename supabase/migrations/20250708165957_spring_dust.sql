/*
  # TaskFlow Application Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `full_name` (text, optional)
      - `avatar_url` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `tasks`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, not null)
      - `description` (text, optional)
      - `completed` (boolean, default false)
      - `priority` (enum: low, medium, high, default medium)
      - `due_date` (timestamptz, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `user_id` (uuid, references profiles.id, not null)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own profiles and tasks

  3. Performance
    - Add indexes on frequently queried columns
    - Add triggers for automatic updated_at timestamp updates

  4. Functions
    - `handle_updated_at()` function for automatic timestamp updates
*/

-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  priority task_priority DEFAULT 'medium',
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  CREATE POLICY "Users can insert own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
  CREATE POLICY "Users can read own tasks"
    ON tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can create own tasks" ON tasks;
  CREATE POLICY "Users can create own tasks"
    ON tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
  CREATE POLICY "Users can update own tasks"
    ON tasks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;
  CREATE POLICY "Users can delete own tasks"
    ON tasks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN OTHERS THEN null;
END $$;

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (drop first if they exist)
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks(completed);