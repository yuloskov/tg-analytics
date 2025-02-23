create table public.shared_reports (
  id uuid default gen_random_uuid() primary key,
  encrypted_data text not null,           -- The encrypted data blob
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone,    -- Optional: when this share expires
  access_count integer default 0,         -- Track how many times it was accessed
  last_accessed_at timestamp with time zone -- Track last access time
);

-- Enable RLS (Row Level Security)
alter table public.shared_reports enable row level security;

-- Create policy to allow anyone to insert (for sharing)
create policy "Allow public to insert shared reports"
  on public.shared_reports
  for insert
  to public
  with check (true);

-- Create policy to allow anyone to read shared reports
create policy "Allow public to read shared reports"
  on public.shared_reports
  for select
  to public
  using (true);

-- Create index on created_at for cleanup queries
create index shared_reports_created_at_idx on public.shared_reports (created_at);

-- Optional: Create function to clean up old reports
create or replace function cleanup_old_shared_reports()
returns void as $$
begin
  delete from public.shared_reports
  where 
    (expires_at is not null and expires_at < now())
    or
    (created_at < now() - interval '30 days');
end;
$$ language plpgsql security definer; 