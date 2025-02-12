import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema for blogs table
/*
create table public.blogs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null,
  excerpt text,
  slug text not null,
  author_id uuid references auth.users(id) not null,
  published_at timestamp with time zone,
  cover_image text
);

-- Enable RLS
alter table public.blogs enable row level security;

-- Create policies
create policy "Users can read published blogs" 
on public.blogs for select 
using (published_at is not null);

create policy "Users can create their own blogs" 
on public.blogs for insert 
with check (auth.uid() = author_id);

create policy "Users can update their own blogs" 
on public.blogs for update 
using (auth.uid() = author_id);

create policy "Users can delete their own blogs" 
on public.blogs for delete 
using (auth.uid() = author_id);

-- Create indexes
create index blogs_author_id_idx on public.blogs(author_id);
create index blogs_slug_idx on public.blogs(slug);
*/
