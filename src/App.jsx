import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { CheckCircle, Circle, Users, DollarSign, FileText, Target, Calendar, AlertTriangle, LogOut, ChevronDown, ChevronRight, User, Lock, Eye, ClipboardList, BarChart3, Plus, Trash2, Save, Loader, TrendingUp, Zap } from 'lucide-react';

// ============== USER DATA (From all documents) ==============
const USERS = {
  rhonda: { password: 'boss2026', name: 'Rhonda (CEO)', role: 'ceo', code: 'H-GR-EXEC-RT-001' },
  chase: { password: 'owner2026', name: 'Chase (Owner)', role: 'owner', code: 'H-SH-EXEC-CC-001' },
  kiarla: { password: 'events2026', name: 'Kiarla', role: 'opsevents', code: 'H-GR-OPS-KT-001' },
  hailey: { password: 'marketing2026', name: 'Hailey', role: 'admin', code: 'H-GR-MKT-HC-001' },
  pepper: { password: 'ops2026', name: 'Pepper', role: 'ops', code: 'H-SH-OPS-PP-001' },
  phil: { password: 'votp2026', name: 'Phil (VOTP)', role: 'votp', code: 'H-VOTP-MKT-PA-001' },
  receptionist: { password: 'front2026', name: 'Receptionist', role: 'receptionist', code: 'H-SH-REC-001' },
  assistant: { password: 'assist2026', name: 'Assistant', role: 'assistant', code: 'H-SH-ASST-001' },
  sales: { password: 'sales2026', name: 'Sales', role: 'sales', code: 'H-SH-SALES-001' },
  grants: { password: 'grants2026', name: 'Grants', role: 'grants', code: 'H-GR-GRNT-001' },
  seo: { password: 'seo2026', name: 'SEO/Blog', role: 'seo', code: 'H-SH-SEO-001' },
  legal: { password: 'legal2026', name: 'Legal', role: 'legal', code: 'H-SH-LEGAL-001' },
  sonny: { password: 'ai2026', name: 'Sonny (AI Social)', role: 'ai_social', code: 'AI-SH-MKT-SONNY-001' },
  penny: { password: 'ai2026', name: 'Penny (AI SEO)', role: 'ai_seo', code: 'AI-SH-SEO-PENNY-001' },
  rachel: { password: 'ai2026', name: 'Rachel (AI Inquiries)', role: 'ai_inquiries', code: 'AI-SH-CRM-RACHEL-001' },
};

// ============== TARGETS ==============
const TARGETS = {
  goals: { skateHausMonthly: 50000, giantRocket6M: 6000000, salesMonthly: 65000, grantGoalMay: 1000000, loungeAsk: 250000 },
  families: { annual: 7000, kidsServed: 3000, quarterlyBus: 300 },
  membership: { price: 150 },
  weekly: { grantsHours: 8, grantsMinimum: 2, marketingHours: 3, meetingHours: 1 },
};

// ============== SENSORY + STEM CONCEPT ==============
const SENSORY_STEM_CONCEPT = [
  { pillar: 'Sensory Regulation', description: 'Low-sensory environment, adaptive skates' },
  { pillar: 'STEM Learning', description: 'Motion, physics, balance, assistive tech' },
  { pillar: 'Inclusion', description: 'Neurodiverse + adaptive access' },
  { pillar: 'Grant Fit', description: 'Education, disability, workforce readiness' },
];

// ============== DASHBOARD METRICS FORMULAS ==============
const DASHBOARD_METRICS = [
  { metric: 'Daily Revenue', formula: 'Admissions + Rentals + Concessions', source: 'POS Daily Report', reviewer: 'Pepper' },
  { metric: 'Membership Conversion', formula: 'Memberships Sold ÷ Unique Visitors', source: 'POS + Door Count', reviewer: 'Chase' },
  { metric: 'Party Conversion', formula: 'Parties Booked ÷ Party Inquiries', source: 'CRM / Inquiry Log', reviewer: 'Pepper' },
  { metric: 'GR Funded Seats', formula: '(Sponsor $ + Grant $) ÷ Cost per Family', source: 'Sponsor Log + Budget', reviewer: 'Hailey' },
  { metric: 'GR → BAU Lift', formula: 'GR Families Becoming Members ÷ GR Families', source: 'GR Attendance + Membership Log', reviewer: 'Chase' },
];

// ============== SPRINT MAP ==============
const SPRINT_MAP = [
  { week: 'Week 1', focus: 'Stabilize Cash', actions: 'Upsells enforced; BAU locked; Dashboards started', owner: 'Pepper / Chase', dates: 'Feb 1-7' },
  { week: 'Week 2', focus: 'Fill Funnel', actions: 'Social posted; FB/LinkedIn value posts; Testimonials captured', owner: 'VOTP / Sonny / Hailey', dates: 'Feb 8-14' },
  { week: 'Week 3', focus: 'Convert', actions: 'Membership + Party bundles; Sponsor calls; GR to BAU conversion', owner: 'Chase / Stan / Pepper', dates: 'Feb 15-21' },
  { week: 'Week 4', focus: 'Prove & Scale', actions: 'Compile proof; Sponsor & grant updates; Offer adjustments', owner: 'Hailey / Chase', dates: 'Feb 22-28' },
];

// ============== WEEKLY REVIEW QUESTIONS ==============
const WEEKLY_REVIEW = [
  { week: 'Week 1', focus: 'Stabilize Cash', questions: 'Are upsells happening? Is BAU smooth?' },
  { week: 'Week 2', focus: 'Fill Funnel', questions: 'Is traffic increasing? Are posts consistent?' },
  { week: 'Week 3', focus: 'Convert', questions: 'Are memberships & parties converting?' },
  { week: 'Week 4', focus: 'Prove & Scale', questions: 'Is proof ready? Funding conversations active?' },
];

// ============== CALENDAR EVENTS ==============
const CALENDAR_EVENTS = [
  { date: '2026-04-01', org: 'GR', title: 'Giant Rocket Kickoff', details: 'Autism Awareness Month launch', status: 'Planned', owner: 'Admin' },
  { date: '2026-02-01', org: 'GR', title: 'Transportation partners locked', details: 'Must be done first week', status: 'Planned', owner: 'Ops' },
  { date: '2026-02-15', org: 'SH/GR', title: 'B2B Sponsorship Event', details: 'Sponsor outreach event', status: 'Planned', owner: 'Sales' },
  { date: '2026-02-17', org: 'GR', title: 'Soft Launch/Media Week Start', details: 'Feb 17-21 media push', status: 'Planned', owner: 'VOTP' },
  { date: '2026-03-14', org: 'GR', title: 'Open House #2 (314 Day)', details: 'Schools + therapists focus', status: 'Planned', owner: 'Kiarla' },
];

// ============== FULL 12-MONTH CALENDAR ==============
const CALENDAR_2026 = {
  jan: { month: 'January 2026', theme: '"Make Paying Easy" — 4 Big Buttons + Membership', primaryOffers: ['PREPAY bundles', 'Party Deposits', 'Membership + Loyalty', 'Merch/Skates'], keyEvents: ['Launch 4 Big Buttons', 'Start weekly Sensory Skate', 'Start biweekly Field Trips'], contentPillars: ['Behind-the-scenes setup', 'Family fun', '"How to prepay" demos', 'Staff intros'], prPartnerships: ['Schools list build', 'Sponsor prospect list', 'Community org introductions'], grantActions: ['Set baseline metrics', 'Build survey forms', 'Start attendance + story capture'], kpis: ['Revenue target $ (month)', 'Leads target (sponsors)', 'Email list growth'], owners: { marketing: 'Website buttons', sales: 'Sponsor list', grants: 'Baseline metrics', kiarla: 'Sensory Skate setup' } },
  feb: { month: 'February 2026', theme: 'Love + Belonging — families + inclusion', primaryOffers: ['Valentine family packs', 'Parties', 'Membership drive', 'Sponsor kit push'], keyEvents: ['Open House #1 (Giant Rocket)', 'Soft Launch/Media Week (Feb 17-21)', 'B2B Sponsorship Event (Feb 15)', 'Transportation partners locked (Feb 1)'], contentPillars: ['Parent testimonials', 'Sensory highlights', 'Party reels', 'Prepay convenience'], prPartnerships: ['Pitch local TV/radio', 'Autism orgs', 'School administrators'], grantActions: ['Capture testimonials + signups', 'Draft 2 grant applications'], kpis: ['Revenue target $', 'Memberships #', 'Sponsor meetings #'], owners: { kiarla: 'Open House #1 PowerPoint/agenda', marketing: 'Valentine promos', sales: 'Sponsor kit push', votp: 'Media Week coverage' } },
  mar: { month: 'March 2026', theme: 'Community Momentum — "314" + school pipeline', primaryOffers: ['Membership + Sensory signups', 'Field Trips', 'Party deposits'], keyEvents: ['Open House #2 (Mar 14 / 314 Day)', 'Spring Break promo'], contentPillars: ['Event recap', 'Countdown to Apr 1', 'Student field trip stories'], prPartnerships: ['Partnership MOUs', 'Sponsor LOIs', 'PTAs + districts'], grantActions: ['Finalize Autism Month impact plan', 'Confirm data collection'], kpis: ['Revenue target $', 'Field trip bookings #', 'Sponsors committed #'], owners: { kiarla: 'Open House #2', assistant: 'Intake pipeline setup', marketing: 'Countdown content', sales: 'LOIs' } },
  apr: { month: 'April 2026', theme: 'Autism Awareness Month — proof + press + funding', primaryOffers: ['Giant Rocket memberships', 'Sponsorships', 'Fundraiser tickets', 'Donor asks'], keyEvents: ['🚀 Apr 1 Kickoff', 'Apr 2 Awareness Day press', 'Major Fundraiser'], contentPillars: ['Daily impact stories', 'Sensory zone visuals', 'Staff training', 'Family wins'], prPartnerships: ['Press blitz', 'Elected/community leaders', 'Corporate sponsors'], grantActions: ['Grant submissions', 'Reporting-ready proof', 'Compile surveys'], kpis: ['Revenue target $', 'Fundraiser $', 'Grant $ submitted'], owners: { votp: 'Press blitz + daily stories', kiarla: 'Fundraiser', grants: 'Grant submissions', sales: 'Sponsorships' } },
  may: { month: 'May 2026', theme: 'Convert Attention → Paid Programs', primaryOffers: ['Camps', 'Afterschool', 'Family packs', 'Parties', 'Merch'], keyEvents: ['Camp/afterschool enrollment push', 'Memorial Day events', '🎯 $1M GRANT TARGET'], contentPillars: ['Program explainers', 'Parent FAQs', '"What\'s included" content'], prPartnerships: ['Schools for summer', 'Youth orgs', 'Corporate volunteer days'], grantActions: ['Follow-ups on grants', 'Mid-program evaluation snapshots'], kpis: ['Revenue target $', 'Enrollments #', 'Merch $', '🎯 $1M GRANT TARGET'], owners: { grants: 'Grant sprint lead', sales: 'Camp enrollments', marketing: 'Program explainers', kiarla: 'Memorial Day' } },
  jun: { month: 'June 2026', theme: 'Close the Half-Year — sponsor summit + proof showcase', primaryOffers: ['Sponsor renewals', 'Multi-year commitments', 'Memberships'], keyEvents: ['Sponsor Summit + Proof Showcase', 'June 30 closeout', '🎯 $6M TARGET CHECK'], contentPillars: ['Sponsor spotlight', 'Year-to-date impact', 'Behind the scenes'], prPartnerships: ['Sponsor renewal calls', 'Grant officers invited to showcase'], grantActions: ['Submit final June grants', 'Reconcile proof/metrics', 'Deliver VOTP assets'], kpis: ['Revenue target $', 'Sponsorship $', '🎯 YTD toward $6M'], owners: { sales: 'Sponsor summit + renewals', assistant: 'Mid-year impact report', kiarla: 'Quarterly bus', marketing: 'Summer bundles' } },
  jul: { month: 'July 2026', theme: 'Summer Energy', primaryOffers: ['Camps', 'Parties', 'Family passes', 'Merch'], keyEvents: ['Summer theme nights', 'Community collabs'], contentPillars: ['Fun reels', 'Camp highlights', 'Staff spotlights'], prPartnerships: ['Tourism + city calendars', 'Youth orgs'], grantActions: ['Collect summer outcomes', 'Prep fall grant cycle'], kpis: ['Revenue target $', 'Attendance #'], owners: { kiarla: 'Theme nights', sales: '5 new sponsor meetings', marketing: 'Camp highlights' } },
  aug: { month: 'August 2026', theme: 'Back-to-School Prep', primaryOffers: ['Afterschool', 'Field trips', 'Memberships'], keyEvents: ['School outreach wave', 'Afterschool signups', 'Quarterly Bus #2 (300 families)'], contentPillars: ['Teacher/school content', 'Program benefits'], prPartnerships: ['Districts + PTAs', 'Special ed coordinators'], grantActions: ['Fall grant shortlist', 'Letters of support'], kpis: ['Bookings #', 'Leads #'], owners: { kiarla: 'Quarterly bus', sales: 'School outreach', grants: 'Fall grant prep', marketing: 'Teacher content' } },
  sep: { month: 'September 2026', theme: 'Fall Kickoff + Inclusion', primaryOffers: ['Afterschool launch', 'Sponsor activations'], keyEvents: ['Quarterly Impact Showcase (optional)'], contentPillars: ['Impact stories', 'Routine + belonging'], prPartnerships: ['Local news "community" segment'], grantActions: ['Grant submissions (fall cycle)'], kpis: ['Revenue $', 'Donors #'], owners: { kiarla: 'Afterschool launch + staff training', grants: 'Fall submissions', marketing: 'Impact stories' } },
  oct: { month: 'October 2026', theme: 'Community + Harvest + Awareness', primaryOffers: ['Halloween events', 'Family packs', 'Sponsor nights'], keyEvents: ['Halloween skate', 'Costume nights', 'Community Impact Summit'], contentPillars: ['Seasonal promo', 'Safety + family'], prPartnerships: ['Community calendars', 'Brands for co-sponsor'], grantActions: ['Data compilation for year-end'], kpis: ['Revenue $', 'Sponsor $'], owners: { kiarla: 'Halloween + Summit', votp: 'Earned media', assistant: 'Data compilation', sales: 'Co-sponsors' } },
  nov: { month: 'November 2026', theme: 'Giving Season', primaryOffers: ['Donor drive', 'Sponsor packages', 'Gift cards'], keyEvents: ['Giving Tuesday campaign', 'Family events'], contentPillars: ['Donor stories', '"Why we give"'], prPartnerships: ['Pitch philanthropy media', 'Foundations'], grantActions: ['Submit year-end grant asks'], kpis: ['Donations $', 'New donors #'], owners: { sales: 'Giving Tuesday + renewals', kiarla: 'Holiday events', grants: 'Year-end asks', marketing: '"Why we give" content' } },
  dec: { month: 'December 2026', theme: 'Year-End Close + Renewal', primaryOffers: ['Membership renewals', 'Parties', 'Gift cards', 'Merch'], keyEvents: ['Holiday events', 'Year-end recap'], contentPillars: ['Recap montage', 'Gratitude', 'Impact metrics'], prPartnerships: ['Sponsor renewals', 'Media recap'], grantActions: ['Grant reports', 'Next year pipeline'], kpis: ['Revenue $', 'Renewals #'], owners: { kiarla: 'Holiday events', sales: 'Sponsor renewals', grants: 'Reports + pipeline', votp: 'Recap montage' } }
};

// ============== CAMPAIGN GANTT ==============
const CAMPAIGN_GANTT = {
  initiatives: [
    { name: 'Website: 4 Big Buttons + Square Checkout', jan: 'H', feb: 'H', mar: 'M', apr: 'M', may: 'M', jun: 'M', jul: 'L', aug: 'L', sep: 'L', oct: 'L', nov: 'L', dec: 'L' },
    { name: 'Membership + Loyalty Push', jan: 'M', feb: 'H', mar: 'H', apr: 'H', may: 'M', jun: 'M', jul: 'M', aug: 'M', sep: 'M', oct: 'M', nov: 'H', dec: 'H' },
    { name: 'Parties + Deposits (always-on)', jan: 'M', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'M', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Monthly Flea Market', jan: 'H', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Sponsor/Corporate Skate Night', jan: 'H', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Giant Rocket: Sensory Skate weekly', jan: 'H', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Giant Rocket: Open Houses + Launch', jan: '-', feb: 'H', mar: 'H', apr: 'H', may: 'M', jun: 'M', jul: 'L', aug: '-', sep: '-', oct: '-', nov: '-', dec: '-' },
    { name: 'Grant Proof Capture (surveys/testimonials)', jan: 'M', feb: 'M', mar: 'M', apr: 'H', may: 'H', jun: 'H', jul: 'M', aug: 'M', sep: 'M', oct: 'M', nov: 'H', dec: 'H' },
    { name: 'STEM-to-Skate Field Trips', jan: 'M', feb: 'M', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'M', aug: 'H', sep: 'H', oct: 'M', nov: 'M', dec: 'M' },
    { name: 'Podcast (build + launch)', jan: 'L', feb: 'L', mar: 'M', apr: 'M', may: 'H', jun: 'M', jul: 'M', aug: 'M', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Giving/Donor Season', jan: '-', feb: '-', mar: '-', apr: '-', may: '-', jun: '-', jul: '-', aug: '-', sep: '-', oct: 'M', nov: 'H', dec: 'H' },
  ]
};

// ============== WEEKLY CONTENT CADENCE ==============
const WEEKLY_CONTENT_CADENCE = [
  { day: 'Mon', shPost: 'Schedule/Hours + Prepay reminder', grPost: 'Impact story/testimonial', votp: 'Yes', emailSms: 'Weekly "What\'s Up"', outreach: 'Sponsor follow-ups', notes: 'Money meeting notes feed content' },
  { day: 'Tue', shPost: 'Party spotlight + packages', grPost: 'Program explainer (Sensory/Bus)', votp: 'Yes', emailSms: '—', outreach: 'School outreach (field trips)', notes: 'VOTP approval window day' },
  { day: 'Wed', shPost: 'Merch/Shop highlight', grPost: 'Coach/staff training + behind scenes', votp: 'Yes', emailSms: 'Mid-week flash offer', outreach: 'Foundation/grant contact', notes: 'Short-form video' },
  { day: 'Thu', shPost: 'Sponsor/corporate invite', grPost: 'Sensory Skate promo', votp: 'Yes', emailSms: 'Sponsor email sequence', outreach: 'Corporate calls', notes: 'Sponsor Skate Night week' },
  { day: 'Fri', shPost: 'Weekend hype + bundles', grPost: 'Field trip/camp highlight', votp: 'Yes', emailSms: 'Weekend reminder', outreach: 'Community orgs', notes: 'Biweekly field trip block' },
  { day: 'Sat', shPost: 'Event coverage (flea market/party)', grPost: 'Family wins recap', votp: 'Yes', emailSms: '—', outreach: 'On-site sponsor asks', notes: 'Capture photos + surveys' },
  { day: 'Sun', shPost: 'Family recap + next week tease', grPost: 'Sensory Skate coverage', votp: 'Yes', emailSms: '—', outreach: '—', notes: 'Collect surveys + testimonials' },
];

// ============== KPI TARGETS ==============
const KPI_TARGETS_INIT = [
  { month: 'Jan', steeloRev: 0, shRev: 0, grFunding: 0, otherRev: 0, total: 0, margin: 0.5 },
  { month: 'Feb', steeloRev: 0, shRev: 0, grFunding: 0, otherRev: 0, total: 0, margin: 0.5 },
  { month: 'Mar', steeloRev: 0, shRev: 0, grFunding: 0, otherRev: 0, total: 0, margin: 0.5 },
  { month: 'Apr', steeloRev: 0, shRev: 0, grFunding: 0, otherRev: 0, total: 0, margin: 0.5 },
  { month: 'May', steeloRev: 0, shRev: 0, grFunding: 0, otherRev: 0, total: 0, margin: 0.5 },
  { month: 'Jun', steeloRev: 0, shRev: 0, grFunding: 0, otherRev: 0, total: 0, margin: 0.5 },
];

// ============== ALL ROLE TASKS ==============
const ALL_ROLE_TASKS = {
  receptionist: { title: '📞 Receptionist', daily: ['Check all inbound messages (email, text, DMs)', 'Book appointments for qualified leads', 'Send intake forms + FAQs to new GR families', 'Tag leads: GR Family / Sponsor / Party / Vendor / Press'], weekly: ['Send "next steps" reminders (48hr rule)', 'Produce lead report'], monthly: ['Clean contact database', 'Update FAQ responses'] },
  assistant: { title: '📋 Assistant', daily: ['Create Today\'s Top 5', 'Assign tasks to owners', 'Update master calendar', 'Route urgent items to Rhonda'], weekly: ['Build Friday Scoreboard', 'Run 1-hour leadership meeting', 'Update 12-month calendar'], monthly: ['Review systems', 'Update role checklists'] },
  admin: { title: '📱 Admin/Marketing (Hailey)', daily: ['Verify logs & proof daily', 'Review Marblism outputs & summarize', 'Post scheduled content', 'Capture event photos/videos'], weekly: ['Build 7-day content calendar', 'Write weekly blast (30 min)', 'Package for VOTP (Thu 6pm)'], monthly: ['Review analytics', 'Plan next month themes'] },
  seo: { title: '🔍 SEO/Blog', daily: ['Check website uptime', 'Monitor keywords'], weekly: ['Write 1 blog (900-1200 words)', 'Update Google Business', 'Add internal links'], monthly: ['SEO audit', 'Backlink outreach (10)', 'Update FAQs'] },
  sales: { title: '💰 Sales', daily: ['Work pipeline', 'Send follow-ups', 'Schedule sponsor calls'], weekly: ['Pipeline report', 'Prep Rhonda for closers', 'Upsell push'], monthly: ['Sponsor renewals', 'Build 50-target list', 'Revenue reconciliation'] },
  grants: { title: '📝 Grants', daily: ['Check deadlines', 'Draft applications', 'Send follow-ups (7d/14d/monthly)'], weekly: ['WED: 8-hour block', 'Submit 2 grants (1 big, 1 small)', 'Update Tracker'], monthly: ['Pipeline review', 'Update Grant Kit', 'Report wins/losses'] },
  opsevents: { title: '🎉⚙️ Ops + Events (Kiarla)', daily: ['Facility check', 'Confirm event staffing', 'Staff scheduling', 'Check equipment/supplies', 'Transportation coordination', 'Coordinate with VOTP for coverage'], weekly: ['Open House planning', 'Event recap + testimonials', 'Update event calendar', 'Transportation partner updates', 'Equipment maintenance check', 'Log all events in Teams'], monthly: ['Monthly flea market', 'Sponsor/Corporate Skate Night', 'Quarterly bus coordination (300 families)', 'Facility improvements', 'Staff training refresh'] },
  ops: { title: '⚙️ Ops (Pepper)', daily: ['Open rink on time', 'Enforce upsells', 'Log attendance', 'Capture photos/video each shift'], weekly: ['Update equipment status', 'Staff scheduling', 'Transportation coordination'], monthly: ['Facility improvements', 'Inventory check'] },
  votp: { title: '📺 VOTP (Phil)', daily: ['Review submitted content', 'Coordinate posting', 'Capture event media'], weekly: ['Receive pack (Thu 6pm)', 'Approve by Fri 1pm', 'Post Saturday'], monthly: ['Media kit refresh', 'PR pitch list', 'Earned media tracking'] },
  legal: { title: '⚖️ Legal', daily: ['Review contracts as needed'], weekly: ['Update legal templates', 'Flag risks', 'Event compliance'], monthly: ['Compliance audit', 'Policy updates', 'Insurance review'] },
  ceo: { title: '👑 CEO (Rhonda)', daily: ['Review Top 5 (10 min)', 'Approve high-impact items', 'Big calls ONLY'], weekly: ['1-hour leadership meeting', 'Review Scoreboard', 'Sign off VOTP (Fri 1pm)'], monthly: ['Approve themes', 'Approve grant targets', 'Review pipeline'] },
  owner: { title: '🏢 Owner (Chase)', daily: ['Daily dashboard review & decision', 'Approve high-priority items'], weekly: ['Weekly strategy review', 'Money meeting', 'Sponsor closer calls'], monthly: ['Financial review', 'Strategic planning'] },
  ai_social: { title: '🤖 Sonny (AI Social)', daily: ['Draft daily social posts'], weekly: ['Generate content ideas', 'A/B test hooks'], monthly: ['Analyze engagement'] },
  ai_seo: { title: '🤖 Penny (AI SEO)', daily: ['Monitor rankings'], weekly: ['Update blogs/SEO weekly', 'Keyword research'], monthly: ['SEO report'] },
  ai_inquiries: { title: '🤖 Rachel (AI Inquiries)', daily: ['Handle inquiries using scripts', 'Route complex to humans'], weekly: ['Update FAQ responses'], monthly: ['Inquiry analysis'] },
};

// ============== NUMBER INPUT COMPONENT (saves on blur only) ==============
const NumberInput = ({ value, onSave, placeholder = "0", className = "" }) => {
  const [localValue, setLocalValue] = useState(value || '');
  
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  return (
    <input
      type="text"
      inputMode="numeric"
      className={`border rounded p-1 text-center ${className}`}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value.replace(/[^0-9]/g, ''))}
      onBlur={() => onSave(parseInt(localValue) || 0)}
      placeholder={placeholder}
    />
  );
};

// ============== LOGIN SCREEN ==============
const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    const user = USERS[username.toLowerCase()];
    if (user && user.password === password) onLogin({ ...user, username: username.toLowerCase() });
    else setError('Invalid username or password');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">🛹 SH / GR</h1>
          <p className="text-xl text-gray-600 mt-2">Dashboard Login</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="Username" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} className="w-full pl-10 pr-4 py-3 border rounded-lg" placeholder="Password" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={handleLogin} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700">Log In</button>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
          <p className="font-medium mb-1">Team: rhonda, chase, kiarla, hailey, pepper, phil</p>
          <p className="font-medium mb-1">Roles: receptionist, assistant, sales, grants, seo, legal</p>
          <p className="font-medium mb-1">AI: sonny, penny, rachel</p>
          <p className="text-gray-500">Passwords: [role]2026 (boss2026, owner2026, events2026...)</p>
        </div>
      </div>
    </div>
  );
};

// ============== MAIN APP ==============
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('feb');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  // ===== DATA STATES =====
  const [completedTasks, setCompletedTasks] = useState({});
  const [scoreboard, setScoreboard] = useState({
    sh: { admissions: 0, rentals: 0, concessions: 0, revenue: 0, uniqueVisitors: 0, membershipsSold: 0, partyInquiries: 0, partiesBooked: 0 },
    gr: { families: 0, newMembers: 0, testimonials: 0 },
    sales: { contacted: 0, meetings: 0, proposals: 0, closed: 0, sponsorDollars: 0 },
    grants: { submitted: 0, followUps: 0, awarded: 0, grantDollars: 0 },
    content: { posts: 0, videos: 0, blasts: 0 }
  });
  const [pipelines, setPipelines] = useState({
    grFamilies: { new: 0, contacted: 0, booked: 0, enrolled: 0, active: 0 },
    sponsors: { target: 0, contacted: 0, meeting: 0, proposal: 0, closed: 0 },
    grants: { research: 0, draft: 0, submitted: 0, followup: 0, won: 0, lost: 0 }
  });
  const [dailyLogs, setDailyLogs] = useState([]);
  const [contentPack, setContentPack] = useState(
    WEEKLY_CONTENT_CADENCE.map((item, i) => ({ ...item, id: i, status: 'Draft' }))
  );
  const [monthlyDashboard, setMonthlyDashboard] = useState({
    jan: { sensorySessions: 0, familiesServed: 0, membershipsSold: 0, sponsorCommitted: 0, grantSubmitted: 0, grantAwarded: 0 },
    feb: { sensorySessions: 0, familiesServed: 0, membershipsSold: 0, sponsorCommitted: 0, grantSubmitted: 0, grantAwarded: 0 },
    mar: { sensorySessions: 0, familiesServed: 0, membershipsSold: 0, sponsorCommitted: 0, grantSubmitted: 0, grantAwarded: 0 },
    apr: { sensorySessions: 0, familiesServed: 0, membershipsSold: 0, sponsorCommitted: 0, grantSubmitted: 0, grantAwarded: 0 },
    may: { sensorySessions: 0, familiesServed: 0, membershipsSold: 0, sponsorCommitted: 0, grantSubmitted: 0, grantAwarded: 0 },
    jun: { sensorySessions: 0, familiesServed: 0, membershipsSold: 0, sponsorCommitted: 0, grantSubmitted: 0, grantAwarded: 0 },
  });
  const [kpiTargets, setKpiTargets] = useState(KPI_TARGETS_INIT);
  
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    program: 'SH',
    eventName: '',
    admissions: 0,
    rentals: 0,
    concessions: 0,
    uniqueVisitors: 0,
    membershipsSold: 0,
    partyInquiries: 0,
    partiesBooked: 0,
    grFamilies: 0,
    grNewMembers: 0,
    sponsorDollars: 0,
    grantDollars: 0,
    sensoryAdaptive: false,
    photosUploaded: false,
    notes: ''
  });

  // ===== LOAD DATA FROM SUPABASE =====
  useEffect(() => {
    if (user) loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const { data: scoreboardData } = await supabase.from('scoreboard').select('*').single();
      if (scoreboardData) setScoreboard(scoreboardData.data);

      const { data: pipelinesData } = await supabase.from('pipelines').select('*').single();
      if (pipelinesData) setPipelines(pipelinesData.data);

      const { data: tasksData } = await supabase.from('tasks').select('*').single();
      if (tasksData) setCompletedTasks(tasksData.data);

      const { data: contentData } = await supabase.from('content_pack').select('*').single();
      if (contentData) setContentPack(contentData.data);

      const { data: monthlyData } = await supabase.from('monthly_dashboard').select('*').single();
      if (monthlyData) setMonthlyDashboard(monthlyData.data);

      const { data: kpiData } = await supabase.from('kpi_targets').select('*').single();
      if (kpiData) setKpiTargets(kpiData.data);

      const { data: logsData } = await supabase.from('daily_logs').select('*').order('created_at', { ascending: false });
      if (logsData) setDailyLogs(logsData);
    } catch (error) {
      console.log('Loading data...', error);
    }
    setLoading(false);
  };

  // ===== SAVE FUNCTIONS =====
  const saveScoreboard = async (newData) => {
    setScoreboard(newData);
    setSaveStatus('Saving...');
    await supabase.from('scoreboard').upsert({ id: 1, data: newData });
    setSaveStatus('Saved ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const savePipelines = async (newData) => {
    setPipelines(newData);
    setSaveStatus('Saving...');
    await supabase.from('pipelines').upsert({ id: 1, data: newData });
    setSaveStatus('Saved ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const saveTasks = async (newData) => {
    setCompletedTasks(newData);
    await supabase.from('tasks').upsert({ id: 1, data: newData });
  };

  const saveContentPack = async (newData) => {
    setContentPack(newData);
    setSaveStatus('Saving...');
    await supabase.from('content_pack').upsert({ id: 1, data: newData });
    setSaveStatus('Saved ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const saveMonthlyDashboard = async (newData) => {
    setMonthlyDashboard(newData);
    setSaveStatus('Saving...');
    await supabase.from('monthly_dashboard').upsert({ id: 1, data: newData });
    setSaveStatus('Saved ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const saveKpiTargets = async (newData) => {
    setKpiTargets(newData);
    setSaveStatus('Saving...');
    await supabase.from('kpi_targets').upsert({ id: 1, data: newData });
    setSaveStatus('Saved ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const addLog = async () => {
    if (newLog.eventName || newLog.admissions > 0) {
      const logEntry = { ...newLog, created_at: new Date().toISOString() };
      const { data } = await supabase.from('daily_logs').insert(logEntry).select();
      if (data) setDailyLogs(prev => [data[0], ...prev]);
      setNewLog({ ...newLog, eventName: '', admissions: 0, rentals: 0, concessions: 0, uniqueVisitors: 0, membershipsSold: 0, partyInquiries: 0, partiesBooked: 0, grFamilies: 0, grNewMembers: 0, sponsorDollars: 0, grantDollars: 0, notes: '' });
      setSaveStatus('Log Added ✓');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const deleteLog = async (id) => {
    await supabase.from('daily_logs').delete().eq('id', id);
    setDailyLogs(prev => prev.filter(log => log.id !== id));
  };

  const toggleTask = (key) => {
    const newTasks = { ...completedTasks, [key]: !completedTasks[key] };
    saveTasks(newTasks);
  };

  const cycleContentStatus = (id) => {
    const statuses = ['Draft', 'Review', 'Approved', 'Posted'];
    const newPack = contentPack.map(item => item.id === id ? { ...item, status: statuses[(statuses.indexOf(item.status) + 1) % 4] } : item);
    saveContentPack(newPack);
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  const userTasks = ALL_ROLE_TASKS[user.role] || ALL_ROLE_TASKS.assistant;
  const isCEO = user.role === 'ceo' || user.role === 'owner';
  const canApproveContent = user.role === 'ceo' || user.role === 'owner' || user.role === 'votp';

  // Calculate actuals from scoreboard and pipelines
  const actualRevenue = (scoreboard.sh.admissions || 0) + (scoreboard.sh.rentals || 0) + (scoreboard.sh.concessions || 0);
  const actualSponsorDollars = scoreboard.sales.sponsorDollars || 0;
  const actualGrantDollars = scoreboard.grants.grantDollars || 0;
  const actualGRFamilies = scoreboard.gr.families || 0;
  const pipelineSponsorsClosed = pipelines.sponsors.closed || 0;
  const pipelineGrantsWon = pipelines.grants.won || 0;
  const totalActual = actualRevenue + actualSponsorDollars + actualGrantDollars;
  const totalTarget = kpiTargets.reduce((sum, k) => sum + (k.shRev || 0) + (k.grFunding || 0) + (k.otherRev || 0), 0);
  const progressPercent = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : 0;

  const CheckItem = ({ checked, onClick, children, small = false }) => (
    <div className={`flex items-center gap-2 ${small ? 'p-1' : 'p-2'} hover:bg-gray-50 rounded cursor-pointer`} onClick={onClick}>
      {checked ? <CheckCircle className="text-green-500 flex-shrink-0" size={small ? 14 : 18} /> : <Circle className="text-gray-300 flex-shrink-0" size={small ? 14 : 18} />}
      <span className={`${small ? 'text-xs' : 'text-sm'} ${checked ? 'line-through text-gray-400' : ''}`}>{children}</span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const colors = { 'Draft': 'bg-gray-200', 'Review': 'bg-yellow-200', 'Approved': 'bg-green-200', 'Posted': 'bg-blue-200' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status]}`}>{status}</span>;
  };

  const PriorityBadge = ({ level }) => {
    const colors = { 'H': 'bg-red-500 text-white', 'M': 'bg-yellow-400', 'L': 'bg-gray-300', '-': 'bg-gray-100 text-gray-400' };
    return <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${colors[level]}`}>{level}</span>;
  };

  // ============== SPRINT VIEW ==============
  const SprintView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">🏃 February Sprint Map</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-800 text-white"><th className="p-2 text-left">Week</th><th className="p-2 text-left">Focus</th><th className="p-2 text-left">Key Actions</th><th className="p-2 text-left">Owner</th><th className="p-2 text-left">Dates</th></tr></thead>
            <tbody>
              {SPRINT_MAP.map((sprint, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-bold">{sprint.week}</td>
                  <td className="p-2"><span className="bg-purple-100 px-2 py-1 rounded text-purple-800 font-medium">{sprint.focus}</span></td>
                  <td className="p-2">{sprint.actions}</td>
                  <td className="p-2 text-gray-600">{sprint.owner}</td>
                  <td className="p-2 text-gray-500">{sprint.dates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">❓ Weekly Review Questions</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {WEEKLY_REVIEW.map((review, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg">
              <p className="font-bold text-purple-700">{review.week}: {review.focus}</p>
              <p className="text-sm text-gray-600 mt-1">{review.questions}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📊 Dashboard Metrics & Formulas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-100"><th className="p-2 text-left">Metric</th><th className="p-2 text-left">Formula</th><th className="p-2 text-left">Input Sources</th><th className="p-2 text-left">Reviewed By</th></tr></thead>
            <tbody>
              {DASHBOARD_METRICS.map((m, i) => (
                <tr key={i} className="border-b"><td className="p-2 font-medium">{m.metric}</td><td className="p-2 font-mono text-xs">{m.formula}</td><td className="p-2 text-gray-600">{m.source}</td><td className="p-2">{m.reviewer}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">🧠 Sensory + STEM to Skate Concept</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {SENSORY_STEM_CONCEPT.map((c, i) => (
            <div key={i} className="bg-blue-50 p-3 rounded-lg">
              <p className="font-bold text-blue-700">{c.pillar}</p>
              <p className="text-sm text-gray-600">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============== KPI VIEW ==============
  const KpiView = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4">
        <h2 className="text-2xl font-bold">🎯 $6,000,000 Goal by June 30, 2026</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="opacity-90">Actual vs Target tracking</p>
          <div className="text-right">
            <p className="text-3xl font-bold">${totalActual.toLocaleString()}</p>
            <p className="text-sm opacity-80">of ${totalTarget.toLocaleString()} ({progressPercent}%)</p>
          </div>
        </div>
        <div className="mt-2 bg-white/20 rounded-full h-4 overflow-hidden">
          <div className="bg-white h-full transition-all" style={{width: `${Math.min(progressPercent, 100)}%`}}></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📊 LIVE ACTUALS (from Scoreboard + Pipelines)</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="bg-purple-100 p-3 rounded-lg text-center border-2 border-purple-300">
            <p className="text-2xl font-bold text-purple-700">${actualRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-600">SH Revenue (Adm+Rent+Conc)</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg text-center border-2 border-green-300">
            <p className="text-2xl font-bold text-green-700">${actualSponsorDollars.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Sponsor $ (from Scoreboard)</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-lg text-center border-2 border-yellow-300">
            <p className="text-2xl font-bold text-yellow-700">${actualGrantDollars.toLocaleString()}</p>
            <p className="text-xs text-gray-600">Grant $ Awarded</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg text-center border-2 border-blue-300">
            <p className="text-2xl font-bold text-blue-700">{actualGRFamilies}</p>
            <p className="text-xs text-gray-600">GR Families</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <div className="bg-gray-100 p-2 rounded text-center"><p className="font-bold text-lg">{pipelineSponsorsClosed}</p><p className="text-xs">Pipeline: Sponsors Closed</p></div>
          <div className="bg-gray-100 p-2 rounded text-center"><p className="font-bold text-lg">{pipelineGrantsWon}</p><p className="text-xs">Pipeline: Grants Won</p></div>
          <div className="bg-gray-100 p-2 rounded text-center"><p className="font-bold text-lg">{pipelines.grFamilies.active || 0}</p><p className="text-xs">Pipeline: GR Active</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📊 Jan-Jun 2026 Revenue TARGETS (type to edit, click out to save)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-100"><th className="p-2">Month</th><th className="p-2">Skate Haus Rev $</th><th className="p-2">Giant Rocket Funding $</th><th className="p-2">Other Rev $</th><th className="p-2">Total $</th><th className="p-2">Margin %</th></tr></thead>
            <tbody>
              {kpiTargets.map((kpi, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2 font-bold">{kpi.month}</td>
                  <td className="p-1"><NumberInput value={kpi.shRev} onSave={(val) => { const newKpi = [...kpiTargets]; newKpi[i].shRev = val; saveKpiTargets(newKpi); }} className="w-full text-sm font-medium" /></td>
                  <td className="p-1"><NumberInput value={kpi.grFunding} onSave={(val) => { const newKpi = [...kpiTargets]; newKpi[i].grFunding = val; saveKpiTargets(newKpi); }} className="w-full text-sm font-medium" /></td>
                  <td className="p-1"><NumberInput value={kpi.otherRev} onSave={(val) => { const newKpi = [...kpiTargets]; newKpi[i].otherRev = val; saveKpiTargets(newKpi); }} className="w-full text-sm font-medium" /></td>
                  <td className="p-2 font-bold text-green-600 text-sm">${((kpi.shRev || 0) + (kpi.grFunding || 0) + (kpi.otherRev || 0)).toLocaleString()}</td>
                  <td className="p-2">{(kpi.margin * 100).toFixed(0)}%</td>
                </tr>
              ))}
              <tr className="bg-gray-200 font-bold">
                <td className="p-2">TOTAL</td>
                <td className="p-2">${kpiTargets.reduce((sum, k) => sum + (k.shRev || 0), 0).toLocaleString()}</td>
                <td className="p-2">${kpiTargets.reduce((sum, k) => sum + (k.grFunding || 0), 0).toLocaleString()}</td>
                <td className="p-2">${kpiTargets.reduce((sum, k) => sum + (k.otherRev || 0), 0).toLocaleString()}</td>
                <td className="p-2 text-green-700">${totalTarget.toLocaleString()}</td>
                <td className="p-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Goal: Total should reach $6,000,000 by June 30</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📈 Key Targets vs Actuals</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-purple-50 p-3 rounded-lg"><p className="text-xs text-gray-500">SH Monthly Target</p><p className="text-xl font-bold text-purple-700">${TARGETS.goals.skateHausMonthly.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">This Week Actual</p><p className="text-lg font-bold text-purple-600">${actualRevenue.toLocaleString()}</p><div className="mt-1 bg-gray-200 rounded-full h-2"><div className="bg-purple-500 h-full rounded-full" style={{width: `${Math.min((actualRevenue / TARGETS.goals.skateHausMonthly) * 100, 100)}%`}}></div></div></div>
          <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-gray-500">GR Goal by June</p><p className="text-xl font-bold text-blue-700">${TARGETS.goals.giantRocket6M.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">Total Actual</p><p className="text-lg font-bold text-blue-600">${totalActual.toLocaleString()}</p><div className="mt-1 bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-full rounded-full" style={{width: `${Math.min((totalActual / TARGETS.goals.giantRocket6M) * 100, 100)}%`}}></div></div></div>
          <div className="bg-green-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Grants by May</p><p className="text-xl font-bold text-green-700">${TARGETS.goals.grantGoalMay.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">Grant $ Awarded</p><p className="text-lg font-bold text-green-600">${actualGrantDollars.toLocaleString()}</p><div className="mt-1 bg-gray-200 rounded-full h-2"><div className="bg-green-500 h-full rounded-full" style={{width: `${Math.min((actualGrantDollars / TARGETS.goals.grantGoalMay) * 100, 100)}%`}}></div></div></div>
          <div className="bg-yellow-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Families Target</p><p className="text-xl font-bold text-yellow-700">{TARGETS.families.annual.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">GR Families Actual</p><p className="text-lg font-bold text-yellow-600">{actualGRFamilies}</p><div className="mt-1 bg-gray-200 rounded-full h-2"><div className="bg-yellow-500 h-full rounded-full" style={{width: `${Math.min((actualGRFamilies / TARGETS.families.annual) * 100, 100)}%`}}></div></div></div>
          <div className="bg-orange-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Kids Served Target</p><p className="text-xl font-bold text-orange-700">{TARGETS.families.kidsServed.toLocaleString()}</p><p className="text-xs text-gray-500 mt-1">Pipeline Active</p><p className="text-lg font-bold text-orange-600">{pipelines.grFamilies.active || 0}</p></div>
          <div className="bg-red-50 p-3 rounded-lg"><p className="text-xs text-gray-500">Quarterly Bus Target</p><p className="text-xl font-bold text-red-700">{TARGETS.families.quarterlyBus}</p><p className="text-xs text-gray-500 mt-1">Enrolled in Pipeline</p><p className="text-lg font-bold text-red-600">{pipelines.grFamilies.enrolled || 0}</p></div>
        </div>
      </div>
    </div>
  );

  // ============== CALENDAR VIEW ==============
  const CalendarView = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 bg-white p-2 rounded-xl shadow">
        {Object.entries(CALENDAR_2026).map(([key, data]) => (
          <button key={key} onClick={() => setSelectedMonth(key)} className={`px-3 py-1 rounded text-sm font-medium ${selectedMonth === key ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{data.month.split(' ')[0].slice(0, 3)}</button>
        ))}
      </div>
      {CALENDAR_2026[selectedMonth] && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
            <h2 className="text-2xl font-bold">{CALENDAR_2026[selectedMonth].month}</h2>
            <p className="text-lg opacity-90">{CALENDAR_2026[selectedMonth].theme}</p>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div><h3 className="font-bold text-purple-700 mb-2">🛒 Primary Offers</h3><div className="flex flex-wrap gap-1">{CALENDAR_2026[selectedMonth].primaryOffers.map((o, i) => <span key={i} className="bg-purple-100 px-2 py-1 rounded text-xs">{o}</span>)}</div></div>
            <div><h3 className="font-bold text-blue-700 mb-2">🎉 Key Events</h3><ul className="text-sm space-y-1">{CALENDAR_2026[selectedMonth].keyEvents.map((e, i) => <li key={i}>• {e}</li>)}</ul></div>
            <div><h3 className="font-bold text-green-700 mb-2">📱 Content Pillars</h3><div className="flex flex-wrap gap-1">{CALENDAR_2026[selectedMonth].contentPillars.map((c, i) => <span key={i} className="bg-green-100 px-2 py-1 rounded text-xs">{c}</span>)}</div></div>
            <div><h3 className="font-bold text-orange-700 mb-2">🤝 PR + Partnerships</h3><ul className="text-sm space-y-1">{CALENDAR_2026[selectedMonth].prPartnerships.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>
            <div><h3 className="font-bold text-yellow-700 mb-2">📝 Grant Actions</h3><ul className="text-sm space-y-1">{CALENDAR_2026[selectedMonth].grantActions.map((g, i) => <li key={i}>• {g}</li>)}</ul></div>
            <div><h3 className="font-bold text-red-700 mb-2">📊 KPIs</h3><div className="flex flex-wrap gap-1">{CALENDAR_2026[selectedMonth].kpis.map((k, i) => <span key={i} className="bg-red-100 px-2 py-1 rounded text-xs font-medium">{k}</span>)}</div></div>
            <div className="md:col-span-2"><h3 className="font-bold text-gray-700 mb-2">👤 Owners</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{Object.entries(CALENDAR_2026[selectedMonth].owners).map(([role, task]) => (<div key={role} className="bg-gray-100 p-2 rounded text-xs"><span className="font-bold uppercase">{role}:</span> {task}</div>))}</div></div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📅 Upcoming Events</h3>
        <div className="space-y-2">
          {CALENDAR_EVENTS.map((event, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">{event.date}</span>
              <span className="bg-blue-100 text-xs px-2 py-1 rounded">{event.org}</span>
              <span className="font-medium">{event.title}</span>
              <span className="text-gray-500 text-sm flex-1">{event.details}</span>
              <span className="text-xs text-gray-400">{event.owner}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============== GANTT VIEW ==============
  const GanttView = () => (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">📊 2026 Campaign Gantt</h2>
      <p className="text-xs text-gray-500 mb-3">H = High push | M = Medium | L = Low | - = Not active</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead><tr className="bg-gray-800 text-white"><th className="p-2 text-left">Initiative</th>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <th key={m} className="p-1">{m}</th>)}</tr></thead>
          <tbody>
            {CAMPAIGN_GANTT.initiatives.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{item.name}</td>
                {['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].map(m => (<td key={m} className="p-1 text-center"><PriorityBadge level={item[m]} /></td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ============== CONTENT VIEW ==============
  const ContentCadenceView = () => (
    <div className="space-y-4">
      <div className="bg-red-100 border-2 border-red-400 p-3 rounded-xl text-center">
        <p className="font-bold text-red-700 text-lg">⚠️ NOTHING POSTS UNTIL APPROVED ⚠️</p>
        <p className="text-sm text-red-600">Thu 6pm submit → Fri 1pm approve → Sat post</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📅 Weekly Content Cadence</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-gray-800 text-white"><th className="p-2">Day</th><th className="p-2">SH Post</th><th className="p-2">GR Post</th><th className="p-2">VOTP?</th><th className="p-2">Email/SMS</th><th className="p-2">Outreach</th><th className="p-2">Notes</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {contentPack.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-bold">{item.day}</td>
                  <td className="p-2">{item.shPost}</td>
                  <td className="p-2">{item.grPost}</td>
                  <td className="p-2 text-center">{item.votp}</td>
                  <td className="p-2">{item.emailSms}</td>
                  <td className="p-2">{item.outreach}</td>
                  <td className="p-2 text-gray-500">{item.notes}</td>
                  <td className="p-2 text-center"><button onClick={() => canApproveContent && cycleContentStatus(item.id)} disabled={!canApproveContent} className={canApproveContent ? 'cursor-pointer' : 'opacity-50'}><StatusBadge status={item.status} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============== LOGS VIEW ==============
  const DailyLogsView = () => (
    <div className="space-y-4">
      <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded-xl">
        <p className="font-bold text-yellow-800">📝 RULE: If it's not logged, it didn't happen → Teams #01-Daily-Logs</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">➕ Add Daily Log (Full POS Data)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
          <div><label className="text-xs font-medium">Date</label><input type="date" className="w-full border rounded p-1" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} /></div>
          <div><label className="text-xs font-medium">Program</label><select className="w-full border rounded p-1" value={newLog.program} onChange={e => setNewLog({...newLog, program: e.target.value})}><option value="SH">SH</option><option value="GR">GR</option><option value="SL">SL</option></select></div>
          <div className="col-span-2"><label className="text-xs font-medium">Event Name</label><input type="text" className="w-full border rounded p-1" value={newLog.eventName} onChange={e => setNewLog({...newLog, eventName: e.target.value})} placeholder="e.g. Sensory Skate" /></div>
          <div><label className="text-xs font-medium">Admissions $</label><input type="number" className="w-full border rounded p-1" value={newLog.admissions || ''} onChange={e => setNewLog({...newLog, admissions: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Rentals $</label><input type="number" className="w-full border rounded p-1" value={newLog.rentals || ''} onChange={e => setNewLog({...newLog, rentals: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Concessions $</label><input type="number" className="w-full border rounded p-1" value={newLog.concessions || ''} onChange={e => setNewLog({...newLog, concessions: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Unique Visitors</label><input type="number" className="w-full border rounded p-1" value={newLog.uniqueVisitors || ''} onChange={e => setNewLog({...newLog, uniqueVisitors: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Memberships Sold</label><input type="number" className="w-full border rounded p-1" value={newLog.membershipsSold || ''} onChange={e => setNewLog({...newLog, membershipsSold: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Party Inquiries</label><input type="number" className="w-full border rounded p-1" value={newLog.partyInquiries || ''} onChange={e => setNewLog({...newLog, partyInquiries: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Parties Booked</label><input type="number" className="w-full border rounded p-1" value={newLog.partiesBooked || ''} onChange={e => setNewLog({...newLog, partiesBooked: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">GR Families</label><input type="number" className="w-full border rounded p-1" value={newLog.grFamilies || ''} onChange={e => setNewLog({...newLog, grFamilies: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">GR New Members</label><input type="number" className="w-full border rounded p-1" value={newLog.grNewMembers || ''} onChange={e => setNewLog({...newLog, grNewMembers: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Sponsor $</label><input type="number" className="w-full border rounded p-1" value={newLog.sponsorDollars || ''} onChange={e => setNewLog({...newLog, sponsorDollars: parseInt(e.target.value) || 0})} /></div>
          <div><label className="text-xs font-medium">Grant $</label><input type="number" className="w-full border rounded p-1" value={newLog.grantDollars || ''} onChange={e => setNewLog({...newLog, grantDollars: parseInt(e.target.value) || 0})} /></div>
          <div className="flex items-center gap-2 col-span-2"><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={newLog.sensoryAdaptive} onChange={e => setNewLog({...newLog, sensoryAdaptive: e.target.checked})} /> Sensory?</label><label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={newLog.photosUploaded} onChange={e => setNewLog({...newLog, photosUploaded: e.target.checked})} /> Photos?</label></div>
          <div className="col-span-2"><label className="text-xs font-medium">Notes</label><input type="text" className="w-full border rounded p-1" value={newLog.notes} onChange={e => setNewLog({...newLog, notes: e.target.value})} /></div>
          <div className="flex items-end"><button onClick={addLog} className="w-full bg-green-600 text-white py-1 rounded font-bold hover:bg-green-700 flex items-center justify-center gap-1"><Plus size={16} /> Add</button></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📋 Logs ({dailyLogs.length})</h2>
        {dailyLogs.length === 0 ? <p className="text-gray-500 text-center py-4">No logs yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-100"><th className="p-1">Date</th><th className="p-1">Prog</th><th className="p-1">Event</th><th className="p-1">Adm$</th><th className="p-1">Rent$</th><th className="p-1">Conc$</th><th className="p-1">Visitors</th><th className="p-1">Memb</th><th className="p-1">Parties</th><th className="p-1">GR Fam</th><th className="p-1">Spons$</th><th className="p-1">Grant$</th><th className="p-1"></th></tr></thead>
              <tbody>
                {dailyLogs.slice(0, 20).map(log => (
                  <tr key={log.id} className="border-b">
                    <td className="p-1">{log.date}</td><td className="p-1 font-bold">{log.program}</td><td className="p-1">{log.eventName}</td><td className="p-1">${log.admissions}</td><td className="p-1">${log.rentals}</td><td className="p-1">${log.concessions}</td><td className="p-1">{log.uniqueVisitors}</td><td className="p-1">{log.membershipsSold}</td><td className="p-1">{log.partiesBooked}</td><td className="p-1">{log.grFamilies}</td><td className="p-1">${log.sponsorDollars}</td><td className="p-1">${log.grantDollars}</td><td className="p-1"><button onClick={() => deleteLog(log.id)} className="text-red-500 hover:text-red-700"><Trash2 size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ============== TEAM VIEW ==============
  const TeamView = () => (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Eye size={24} /> Team Checklists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(ALL_ROLE_TASKS).map(([roleKey, role]) => (
          <div key={roleKey} className="bg-gray-50 rounded-lg p-3 border text-xs">
            <h3 className="font-bold mb-2">{role.title}</h3>
            <p className="text-blue-600 font-semibold">DAILY</p>
            {role.daily.map((t, i) => <CheckItem key={`${roleKey}-d-${i}`} small checked={completedTasks[`${roleKey}-d-${i}`]} onClick={() => toggleTask(`${roleKey}-d-${i}`)}>{t}</CheckItem>)}
            <p className="text-green-600 font-semibold mt-1">WEEKLY</p>
            {role.weekly.map((t, i) => <CheckItem key={`${roleKey}-w-${i}`} small checked={completedTasks[`${roleKey}-w-${i}`]} onClick={() => toggleTask(`${roleKey}-w-${i}`)}>{t}</CheckItem>)}
            <p className="text-purple-600 font-semibold mt-1">MONTHLY</p>
            {role.monthly.map((t, i) => <CheckItem key={`${roleKey}-m-${i}`} small checked={completedTasks[`${roleKey}-m-${i}`]} onClick={() => toggleTask(`${roleKey}-m-${i}`)}>{t}</CheckItem>)}
          </div>
        ))}
      </div>
    </div>
  );

  // ============== DASHBOARD VIEW ==============
  const DashboardView = () => (
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3">
        <p className="font-bold text-red-700">🚨 EMERGENCY: 1) Breathe 2) Text Rhonda 3) Log in Teams #01-Daily-Logs with URGENT</p>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 border-2 border-purple-300">
        <div className="flex justify-between items-start">
          <div><p className="text-xs text-purple-600 font-semibold">{CALENDAR_2026[selectedMonth].month}</p><h2 className="text-lg font-bold text-purple-800">{CALENDAR_2026[selectedMonth].theme}</h2></div>
          <div className="text-right text-xs"><p className="font-bold">${TARGETS.goals.skateHausMonthly.toLocaleString()}/mo SH</p><p className="font-bold">${TARGETS.goals.grantGoalMay.toLocaleString()} grants by May</p><p className="font-bold text-purple-700">$6M GR by June</p></div>
        </div>
      </div>
      {isCEO && (
        <div className="bg-yellow-50 rounded-xl p-3 border-2 border-yellow-400">
          <h3 className="font-bold text-yellow-800 mb-2">👑 YOUR DECISIONS</h3>
          <CheckItem checked={completedTasks['ceo-1']} onClick={() => toggleTask('ceo-1')}>Approve VOTP content pack — Fri 1pm</CheckItem>
          <CheckItem checked={completedTasks['ceo-2']} onClick={() => toggleTask('ceo-2')}>Sign sponsor proposal — This week</CheckItem>
          <CheckItem checked={completedTasks['ceo-3']} onClick={() => toggleTask('ceo-3')}>Approve Wednesday grant — Wed</CheckItem>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-2">📋 MY TASKS — {user.name}</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-blue-50 p-2 rounded"><p className="text-xs font-bold text-blue-700 mb-1">DAILY</p>{userTasks.daily.map((t, i) => <CheckItem key={i} small checked={completedTasks[`my-d-${i}`]} onClick={() => toggleTask(`my-d-${i}`)}>{t}</CheckItem>)}</div>
          <div className="bg-green-50 p-2 rounded"><p className="text-xs font-bold text-green-700 mb-1">WEEKLY</p>{userTasks.weekly.map((t, i) => <CheckItem key={i} small checked={completedTasks[`my-w-${i}`]} onClick={() => toggleTask(`my-w-${i}`)}>{t}</CheckItem>)}</div>
          <div className="bg-purple-50 p-2 rounded"><p className="text-xs font-bold text-purple-700 mb-1">MONTHLY</p>{userTasks.monthly.map((t, i) => <CheckItem key={i} small checked={completedTasks[`my-m-${i}`]} onClick={() => toggleTask(`my-m-${i}`)}>{t}</CheckItem>)}</div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-3">
        <h3 className="font-bold text-sm mb-2">📅 WEEKLY RHYTHM</h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {[{d:'MON',l:'PLAN',c:'#dbeafe'},{d:'TUE',l:'PEOPLE',c:'#dcfce7'},{d:'WED',l:'GRANTS',c:'#fef9c3'},{d:'THU',l:'CONTENT',c:'#ffedd5'},{d:'FRI',l:'MONEY',c:'#fee2e2'},{d:'SAT',l:'POST',c:'#f3e8ff'},{d:'SUN',l:'RESET',c:'#f3f4f6'}].map(x => (<div key={x.d} className="p-2 rounded" style={{backgroundColor:x.c}}><p className="font-bold">{x.d}</p><p>{x.l}</p></div>))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-gray-800 mb-2">📊 WEEKLY SCOREBOARD</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-50 p-2 rounded">
              <p className="font-bold text-purple-700">🛹 SKATE HAUS</p>
              <NumberInput value={scoreboard.sh.admissions} onSave={(val) => saveScoreboard({...scoreboard, sh: {...scoreboard.sh, admissions: val}})} placeholder="Admissions $" className="w-full mt-1" />
              <NumberInput value={scoreboard.sh.rentals} onSave={(val) => saveScoreboard({...scoreboard, sh: {...scoreboard.sh, rentals: val}})} placeholder="Rentals $" className="w-full mt-1" />
              <NumberInput value={scoreboard.sh.membershipsSold} onSave={(val) => saveScoreboard({...scoreboard, sh: {...scoreboard.sh, membershipsSold: val}})} placeholder="Memberships #" className="w-full mt-1" />
              <NumberInput value={scoreboard.sh.partiesBooked} onSave={(val) => saveScoreboard({...scoreboard, sh: {...scoreboard.sh, partiesBooked: val}})} placeholder="Parties Booked" className="w-full mt-1" />
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <p className="font-bold text-blue-700">🚀 GIANT ROCKET</p>
              <NumberInput value={scoreboard.gr.families} onSave={(val) => saveScoreboard({...scoreboard, gr: {...scoreboard.gr, families: val}})} placeholder="Families" className="w-full mt-1" />
              <NumberInput value={scoreboard.gr.newMembers} onSave={(val) => saveScoreboard({...scoreboard, gr: {...scoreboard.gr, newMembers: val}})} placeholder="New Members" className="w-full mt-1" />
              <NumberInput value={scoreboard.gr.testimonials} onSave={(val) => saveScoreboard({...scoreboard, gr: {...scoreboard.gr, testimonials: val}})} placeholder="Testimonials" className="w-full mt-1" />
            </div>
            <div className="bg-green-50 p-2 rounded">
              <p className="font-bold text-green-700">💰 SALES</p>
              <NumberInput value={scoreboard.sales.contacted} onSave={(val) => saveScoreboard({...scoreboard, sales: {...scoreboard.sales, contacted: val}})} placeholder="Contacted" className="w-full mt-1" />
              <NumberInput value={scoreboard.sales.meetings} onSave={(val) => saveScoreboard({...scoreboard, sales: {...scoreboard.sales, meetings: val}})} placeholder="Meetings" className="w-full mt-1" />
              <NumberInput value={scoreboard.sales.sponsorDollars} onSave={(val) => saveScoreboard({...scoreboard, sales: {...scoreboard.sales, sponsorDollars: val}})} placeholder="Sponsor $" className="w-full mt-1" />
            </div>
            <div className="bg-yellow-50 p-2 rounded">
              <p className="font-bold text-yellow-700">📝 GRANTS</p>
              <NumberInput value={scoreboard.grants.submitted} onSave={(val) => saveScoreboard({...scoreboard, grants: {...scoreboard.grants, submitted: val}})} placeholder="Submitted" className="w-full mt-1" />
              <NumberInput value={scoreboard.grants.followUps} onSave={(val) => saveScoreboard({...scoreboard, grants: {...scoreboard.grants, followUps: val}})} placeholder="Follow-ups" className="w-full mt-1" />
              <NumberInput value={scoreboard.grants.grantDollars} onSave={(val) => saveScoreboard({...scoreboard, grants: {...scoreboard.grants, grantDollars: val}})} placeholder="$ Awarded" className="w-full mt-1" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-bold text-gray-800 mb-2">🔄 PIPELINES</h3>
          <div className="space-y-2 text-xs">
            {[
              {name:'🚀 GR Families', key:'grFamilies', stages:['new','contacted','booked','enrolled','active']},
              {name:'💼 Sponsors', key:'sponsors', stages:['target','contacted','meeting','proposal','closed']},
              {name:'📝 Grants', key:'grants', stages:['research','draft','submitted','followup','won','lost']}
            ].map(p => (
              <div key={p.key} className="bg-gray-50 p-2 rounded">
                <p className="font-bold mb-1">{p.name}</p>
                <div className="flex gap-1">
                  {p.stages.map(s => (
                    <div key={s} className="flex-1 text-center">
                      <p className="text-xs text-gray-500 capitalize">{s}</p>
                      <NumberInput value={pipelines[p.key][s]} onSave={(val) => savePipelines({...pipelines, [p.key]: {...pipelines[p.key], [s]: val}})} className="w-full font-bold" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-white rounded-xl p-3 text-xs">
        <p className="font-bold mb-1">📜 THE RULES</p>
        <div className="grid grid-cols-2 gap-1">
          <p>1. Not logged = didn't happen</p><p>2. Nothing posts until approved</p>
          <p>3. Wed = Grants (8hrs, 2 min)</p><p>4. Follow-up: 7d→14d→monthly</p>
          <p>5. Rhonda: Approve+Decide+Close</p><p>6. Weekly meeting = 1hr max</p>
          <p className="col-span-2">7. Scoreboard ships Friday — NO EXCEPTIONS</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div><h1 className="text-xl font-bold">🛹 SH / GR Dashboard</h1><p className="text-xs opacity-80">Skate Haus + Giant Rocket</p></div>
          <div className="flex items-center gap-3">
            {saveStatus && <span className="text-xs bg-white/20 px-2 py-1 rounded">{saveStatus}</span>}
            {loading && <Loader className="animate-spin" size={18} />}
            <div className="text-right"><p className="font-bold text-sm">{user.name}</p><p className="text-xs opacity-80">{user.code}</p></div>
            <button onClick={() => setUser(null)} className="bg-white/20 p-2 rounded hover:bg-white/30"><LogOut size={18} /></button>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-white">
        <div className="max-w-6xl mx-auto flex flex-wrap">
          {[{id:'dashboard',label:'📊 Dashboard'},{id:'sprint',label:'🏃 Sprint'},{id:'kpi',label:'🎯 KPIs'},{id:'calendar',label:'📅 Calendar'},{id:'gantt',label:'📈 Gantt'},{id:'content',label:'📱 Content'},{id:'logs',label:'📝 Logs'},{id:'team',label:'👥 Team'}].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 text-sm font-medium ${activeTab === tab.id ? 'bg-purple-600' : 'hover:bg-gray-700'}`}>{tab.label}</button>
          ))}
        </div>
      </div>
      <div className="bg-gray-700 text-white py-1">
        <div className="max-w-6xl mx-auto flex justify-center gap-4 text-xs">
          <span>SH = Skate Haus</span><span>GR = Giant Rocket</span><span>SL = Lounge</span><span>VOTP = Media</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'sprint' && <SprintView />}
        {activeTab === 'kpi' && <KpiView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'gantt' && <GanttView />}
        {activeTab === 'content' && <ContentCadenceView />}
        {activeTab === 'logs' && <DailyLogsView />}
        {activeTab === 'team' && <TeamView />}
      </div>
    </div>
  );
}

export default App;
