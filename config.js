// ============================================================
//  EQUILIBRIUM — Configuration
//  Replace the two values below with your own Supabase keys.
//
//  Where to find them:
//  1. Go to https://supabase.com and open your project
//  2. Click "Project Settings" (gear icon, bottom left)
//  3. Click "API"
//  4. Copy "Project URL" → paste as SUPABASE_URL below
//  5. Copy "anon public" key → paste as SUPABASE_ANON_KEY below
// ============================================================

const SUPABASE_URL  = 'https://zylysujwseykewcrvcfr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bHlzdWp3c2V5a2V3Y3J2Y2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTUzMDEsImV4cCI6MjA5MjI3MTMwMX0.kRMRpgmxsJFBIDO8MShrC_TtKJKfj2Z6iDuFAAczWV4';

// Initialise the Supabase client (used throughout app.js)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
