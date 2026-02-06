# SH/GR Dashboard v2

Skate Haus + Giant Rocket Operations Dashboard

## Features
- 8 Tabs: Dashboard, Sprint, KPIs, Calendar, Gantt, Content, Logs, Team
- 15 User logins with role-based views
- Full 12-month marketing calendar
- Campaign Gantt with priorities
- Weekly content cadence with VOTP approval workflow
- Daily logging with full POS data fields
- Sprint map and review questions
- KPI targets tracking toward $6M goal
- All data saves to Supabase

## Logins

| Username | Password | Role |
|----------|----------|------|
| rhonda | boss2026 | CEO |
| chase | owner2026 | Owner |
| kiarla | events2026 | Ops + Events |
| hailey | marketing2026 | Admin/Marketing |
| pepper | ops2026 | Ops |
| phil | votp2026 | VOTP |
| receptionist | front2026 | Receptionist |
| assistant | assist2026 | Assistant |
| sales | sales2026 | Sales |
| grants | grants2026 | Grants |
| seo | seo2026 | SEO/Blog |
| legal | legal2026 | Legal |
| sonny | ai2026 | AI Social |
| penny | ai2026 | AI SEO |
| rachel | ai2026 | AI Inquiries |

## Supabase SQL Schema

Run this in Supabase SQL Editor:

```sql
-- Scoreboard
CREATE TABLE IF NOT EXISTS scoreboard (
  id INTEGER PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pipelines
CREATE TABLE IF NOT EXISTS pipelines (
  id INTEGER PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (checkboxes)
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Pack
CREATE TABLE IF NOT EXISTS content_pack (
  id INTEGER PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Monthly Dashboard
CREATE TABLE IF NOT EXISTS monthly_dashboard (
  id INTEGER PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- KPI Targets
CREATE TABLE IF NOT EXISTS kpi_targets (
  id INTEGER PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Daily Logs
CREATE TABLE IF NOT EXISTS daily_logs (
  id SERIAL PRIMARY KEY,
  date DATE,
  program TEXT,
  eventName TEXT,
  admissions INTEGER DEFAULT 0,
  rentals INTEGER DEFAULT 0,
  concessions INTEGER DEFAULT 0,
  uniqueVisitors INTEGER DEFAULT 0,
  membershipsSold INTEGER DEFAULT 0,
  partyInquiries INTEGER DEFAULT 0,
  partiesBooked INTEGER DEFAULT 0,
  grFamilies INTEGER DEFAULT 0,
  grNewMembers INTEGER DEFAULT 0,
  sponsorDollars INTEGER DEFAULT 0,
  grantDollars INTEGER DEFAULT 0,
  sensoryAdaptive BOOLEAN DEFAULT FALSE,
  photosUploaded BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE scoreboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pack ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow all" ON scoreboard FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON pipelines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON content_pack FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON monthly_dashboard FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON kpi_targets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON daily_logs FOR ALL USING (true) WITH CHECK (true);
```

## Vercel Environment Variables

Add these in Vercel project settings:

- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon/public key
