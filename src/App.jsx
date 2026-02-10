import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { CheckCircle, Circle, User, Lock, LogOut, Plus, Trash2, Loader, Eye } from 'lucide-react';

// ============== USER DATA ==============
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
};

// ============== STATIC DATA ==============
const SENSORY_STEM_CONCEPT = [
  { pillar: 'Sensory Regulation', description: 'Low-sensory environment, adaptive skates' },
  { pillar: 'STEM Learning', description: 'Motion, physics, balance, assistive tech' },
  { pillar: 'Inclusion', description: 'Neurodiverse + adaptive access' },
  { pillar: 'Grant Fit', description: 'Education, disability, workforce readiness' },
];

const DASHBOARD_METRICS = [
  { metric: 'Daily Revenue', formula: 'Admissions + Rentals + Concessions', source: 'POS Daily Report', reviewer: 'Pepper' },
  { metric: 'Membership Conversion', formula: 'Memberships Sold ÷ Unique Visitors', source: 'POS + Door Count', reviewer: 'Chase' },
  { metric: 'Party Conversion', formula: 'Parties Booked ÷ Party Inquiries', source: 'CRM / Inquiry Log', reviewer: 'Pepper' },
  { metric: 'GR Funded Seats', formula: '(Sponsor $ + Grant $) ÷ Cost per Family', source: 'Sponsor Log + Budget', reviewer: 'Hailey' },
  { metric: 'GR → BAU Lift', formula: 'GR Families Becoming Members ÷ GR Families', source: 'GR Attendance + Membership Log', reviewer: 'Chase' },
];

const SPRINT_MAP = [
  { week: 'Week 1', focus: 'Stabilize Cash', actions: 'Upsells enforced; BAU locked; Dashboards started', owner: 'Pepper / Chase', dates: 'Feb 1-7' },
  { week: 'Week 2', focus: 'Fill Funnel', actions: 'Social posted; FB/LinkedIn value posts; Testimonials captured', owner: 'VOTP / Sonny / Hailey', dates: 'Feb 8-14' },
  { week: 'Week 3', focus: 'Convert', actions: 'Membership + Party bundles; Sponsor calls; GR to BAU conversion', owner: 'Chase / Stan / Pepper', dates: 'Feb 15-21' },
  { week: 'Week 4', focus: 'Prove & Scale', actions: 'Compile proof; Sponsor & grant updates; Offer adjustments', owner: 'Hailey / Chase', dates: 'Feb 22-28' },
];

const WEEKLY_REVIEW = [
  { week: 'Week 1', focus: 'Stabilize Cash', questions: 'Are upsells happening? Is BAU smooth?' },
  { week: 'Week 2', focus: 'Fill Funnel', questions: 'Is traffic increasing? Are posts consistent?' },
  { week: 'Week 3', focus: 'Convert', questions: 'Are memberships & parties converting?' },
  { week: 'Week 4', focus: 'Prove & Scale', questions: 'Is proof ready? Funding conversations active?' },
];

const CALENDAR_EVENTS = [
  // January
  { date: '2026-01-06', org: 'SH', title: 'Launch 4 Big Buttons', details: 'Website payment buttons go live', owner: 'Marketing' },
  { date: '2026-01-10', org: 'GR', title: 'Start Weekly Sensory Skate', details: 'Weekly recurring program begins', owner: 'Kiarla' },
  { date: '2026-01-17', org: 'GR', title: 'Start Biweekly Field Trips', details: 'School field trip program begins', owner: 'Kiarla' },
  // February
  { date: '2026-02-01', org: 'GR', title: 'Transportation Partners Locked', details: 'Must be done first week', owner: 'Ops' },
  { date: '2026-02-07', org: 'GR', title: 'Open House #1', details: 'Giant Rocket community intro', owner: 'Kiarla' },
  { date: '2026-02-15', org: 'SH/GR', title: 'B2B Sponsorship Event', details: 'Sponsor outreach event', owner: 'Sales' },
  { date: '2026-02-17', org: 'GR', title: 'Soft Launch/Media Week Start', details: 'Feb 17-21 media push', owner: 'VOTP' },
  // March
  { date: '2026-03-14', org: 'GR', title: 'Open House #2 (314 Day)', details: 'Schools + therapists focus', owner: 'Kiarla' },
  { date: '2026-03-16', org: 'SH', title: 'Spring Break Promo Start', details: 'Spring break programming', owner: 'Marketing' },
  // April
  { date: '2026-04-01', org: 'GR', title: '🚀 Giant Rocket Kickoff', details: 'Autism Awareness Month launch', owner: 'Admin' },
  { date: '2026-04-02', org: 'GR', title: 'Awareness Day Press', details: 'World Autism Awareness Day media', owner: 'VOTP' },
  { date: '2026-04-18', org: 'GR', title: 'Major Fundraiser', details: 'Giant Rocket fundraising event', owner: 'Kiarla' },
  // May
  { date: '2026-05-01', org: 'GR', title: 'Camp/Afterschool Enrollment Push', details: 'Summer enrollment drive', owner: 'Sales' },
  { date: '2026-05-25', org: 'SH', title: 'Memorial Day Events', details: 'Holiday weekend programming', owner: 'Kiarla' },
  { date: '2026-05-31', org: 'GR', title: '🎯 $1M Grant Target', details: 'Grant goal deadline', owner: 'Grants' },
  // June
  { date: '2026-06-15', org: 'SH/GR', title: 'Sponsor Summit + Proof Showcase', details: 'Mid-year sponsor event', owner: 'Sales' },
  { date: '2026-06-20', org: 'GR', title: 'Quarterly Bus #1', details: '300 families transportation', owner: 'Kiarla' },
  { date: '2026-06-30', org: 'GR', title: '🎯 $6M Target Check', details: 'June 30 closeout + review', owner: 'Chase' },
  // July
  { date: '2026-07-04', org: 'SH', title: 'July 4th Theme Night', details: 'Independence Day celebration', owner: 'Kiarla' },
  { date: '2026-07-11', org: 'SH', title: 'Summer Theme Nights', details: 'Weekly summer events begin', owner: 'Kiarla' },
  { date: '2026-07-25', org: 'SH/GR', title: 'Community Collabs', details: 'Partner organization events', owner: 'Sales' },
  // August
  { date: '2026-08-01', org: 'SH/GR', title: 'School Outreach Wave', details: 'Back-to-school partnerships', owner: 'Sales' },
  { date: '2026-08-10', org: 'GR', title: 'Afterschool Signups', details: 'Fall program registration', owner: 'Admin' },
  { date: '2026-08-15', org: 'GR', title: 'Quarterly Bus #2', details: '300 families transportation', owner: 'Kiarla' },
  // September
  { date: '2026-09-01', org: 'GR', title: 'Afterschool Launch', details: 'Fall afterschool program starts', owner: 'Kiarla' },
  { date: '2026-09-15', org: 'GR', title: 'Quarterly Impact Showcase', details: 'Program results presentation', owner: 'Admin' },
  // October
  { date: '2026-10-17', org: 'SH', title: 'Halloween Skate', details: 'Costume night event', owner: 'Kiarla' },
  { date: '2026-10-24', org: 'SH', title: 'Costume Nights', details: 'Halloween themed sessions', owner: 'Kiarla' },
  { date: '2026-10-31', org: 'SH', title: 'Halloween Party', details: 'Main Halloween event', owner: 'Kiarla' },
  // November
  { date: '2026-11-15', org: 'GR', title: 'Quarterly Bus #3', details: '300 families transportation', owner: 'Kiarla' },
  { date: '2026-11-21', org: 'SH/GR', title: 'Family Events', details: 'Thanksgiving week activities', owner: 'Kiarla' },
  { date: '2026-12-01', org: 'SH/GR', title: 'Giving Tuesday Campaign', details: 'Donor drive kickoff', owner: 'Sales' },
  // December
  { date: '2026-12-05', org: 'SH', title: 'Holiday Events Begin', details: 'Seasonal programming starts', owner: 'Kiarla' },
  { date: '2026-12-15', org: 'SH/GR', title: 'Sponsor Renewals Due', details: 'Next year commitments', owner: 'Sales' },
  { date: '2026-12-20', org: 'GR', title: 'Quarterly Bus #4', details: '300 families transportation', owner: 'Kiarla' },
  { date: '2026-12-31', org: 'SH/GR', title: 'Year-End Recap', details: 'Annual closeout + reports', owner: 'Admin' },
];

const CALENDAR_2026 = {
  jan: { month: 'January 2026', theme: '"Make Paying Easy" — 4 Big Buttons + Membership', primaryOffers: ['PREPAY bundles', 'Party Deposits', 'Membership + Loyalty', 'Merch/Skates'], keyEvents: ['Launch 4 Big Buttons', 'Start weekly Sensory Skate'], contentPillars: ['Behind-the-scenes setup', 'Family fun'], prPartnerships: ['Schools list build', 'Sponsor prospect list'], grantActions: ['Set baseline metrics', 'Build survey forms'], kpis: ['Revenue target $', 'Leads target'], owners: { marketing: 'Website buttons', sales: 'Sponsor list', grants: 'Baseline metrics', kiarla: 'Sensory Skate setup' } },
  feb: { month: 'February 2026', theme: 'Love + Belonging — families + inclusion', primaryOffers: ['Valentine family packs', 'Parties', 'Membership drive'], keyEvents: ['Open House #1', 'Soft Launch/Media Week', 'B2B Sponsorship Event'], contentPillars: ['Parent testimonials', 'Sensory highlights', 'Party reels'], prPartnerships: ['Pitch local TV/radio', 'Autism orgs'], grantActions: ['Capture testimonials', 'Draft 2 grant applications'], kpis: ['Revenue target $', 'Memberships #'], owners: { kiarla: 'Open House #1', marketing: 'Valentine promos', sales: 'Sponsor kit push', votp: 'Media Week' } },
  mar: { month: 'March 2026', theme: 'Community Momentum — "314" + school pipeline', primaryOffers: ['Membership signups', 'Field Trips', 'Party deposits'], keyEvents: ['Open House #2 (Mar 14)', 'Spring Break promo'], contentPillars: ['Event recap', 'Countdown to Apr 1'], prPartnerships: ['Partnership MOUs', 'Sponsor LOIs'], grantActions: ['Finalize Autism Month plan'], kpis: ['Revenue $', 'Field trip bookings'], owners: { kiarla: 'Open House #2', marketing: 'Countdown content', sales: 'LOIs' } },
  apr: { month: 'April 2026', theme: 'Autism Awareness Month — proof + press + funding', primaryOffers: ['Giant Rocket memberships', 'Sponsorships', 'Fundraiser tickets'], keyEvents: ['🚀 Apr 1 Kickoff', 'Apr 2 Awareness Day press', 'Major Fundraiser'], contentPillars: ['Daily impact stories', 'Family wins'], prPartnerships: ['Press blitz', 'Corporate sponsors'], grantActions: ['Grant submissions', 'Compile surveys'], kpis: ['Revenue $', 'Fundraiser $', 'Grant $ submitted'], owners: { votp: 'Press blitz', kiarla: 'Fundraiser', grants: 'Grant submissions' } },
  may: { month: 'May 2026', theme: 'Convert Attention → Paid Programs', primaryOffers: ['Camps', 'Afterschool', 'Family packs'], keyEvents: ['Camp enrollment push', 'Memorial Day events', '🎯 $1M GRANT TARGET'], contentPillars: ['Program explainers', 'Parent FAQs'], prPartnerships: ['Schools for summer', 'Youth orgs'], grantActions: ['Follow-ups on grants'], kpis: ['Revenue $', 'Enrollments #', '🎯 $1M GRANT'], owners: { grants: 'Grant sprint lead', sales: 'Camp enrollments' } },
  jun: { month: 'June 2026', theme: 'Close the Half-Year — sponsor summit', primaryOffers: ['Sponsor renewals', 'Memberships'], keyEvents: ['Sponsor Summit', 'June 30 closeout', '🎯 $6M TARGET CHECK'], contentPillars: ['Sponsor spotlight', 'Year-to-date impact'], prPartnerships: ['Sponsor renewal calls'], grantActions: ['Submit final June grants'], kpis: ['Revenue $', 'Sponsorship $', '🎯 YTD toward $6M'], owners: { sales: 'Sponsor summit', kiarla: 'Quarterly bus' } },
  jul: { month: 'July 2026', theme: 'Summer Energy', primaryOffers: ['Camps', 'Parties', 'Family passes'], keyEvents: ['Summer theme nights'], contentPillars: ['Fun reels', 'Camp highlights'], prPartnerships: ['Tourism calendars'], grantActions: ['Collect summer outcomes'], kpis: ['Revenue $', 'Attendance #'], owners: { kiarla: 'Theme nights', sales: '5 new sponsor meetings' } },
  aug: { month: 'August 2026', theme: 'Back-to-School Prep', primaryOffers: ['Afterschool', 'Field trips'], keyEvents: ['School outreach wave', 'Quarterly Bus #2'], contentPillars: ['Teacher content'], prPartnerships: ['Districts + PTAs'], grantActions: ['Fall grant shortlist'], kpis: ['Bookings #', 'Leads #'], owners: { kiarla: 'Quarterly bus', sales: 'School outreach' } },
  sep: { month: 'September 2026', theme: 'Fall Kickoff + Inclusion', primaryOffers: ['Afterschool launch'], keyEvents: ['Quarterly Impact Showcase'], contentPillars: ['Impact stories'], prPartnerships: ['Local news segment'], grantActions: ['Grant submissions (fall)'], kpis: ['Revenue $', 'Donors #'], owners: { kiarla: 'Afterschool launch', grants: 'Fall submissions' } },
  oct: { month: 'October 2026', theme: 'Community + Harvest', primaryOffers: ['Halloween events', 'Family packs'], keyEvents: ['Halloween skate', 'Community Impact Summit'], contentPillars: ['Seasonal promo'], prPartnerships: ['Community calendars'], grantActions: ['Data compilation'], kpis: ['Revenue $', 'Sponsor $'], owners: { kiarla: 'Halloween + Summit', votp: 'Earned media' } },
  nov: { month: 'November 2026', theme: 'Giving Season', primaryOffers: ['Donor drive', 'Gift cards'], keyEvents: ['Giving Tuesday campaign'], contentPillars: ['Donor stories'], prPartnerships: ['Foundations'], grantActions: ['Year-end grant asks'], kpis: ['Donations $', 'New donors #'], owners: { sales: 'Giving Tuesday', kiarla: 'Holiday events' } },
  dec: { month: 'December 2026', theme: 'Year-End Close', primaryOffers: ['Membership renewals', 'Parties', 'Gift cards'], keyEvents: ['Holiday events', 'Year-end recap'], contentPillars: ['Recap montage', 'Gratitude'], prPartnerships: ['Sponsor renewals'], grantActions: ['Grant reports', 'Next year pipeline'], kpis: ['Revenue $', 'Renewals #'], owners: { kiarla: 'Holiday events', sales: 'Sponsor renewals' } }
};

const CAMPAIGN_GANTT = {
  initiatives: [
    { name: 'Website: 4 Big Buttons', jan: 'H', feb: 'H', mar: 'M', apr: 'M', may: 'M', jun: 'M', jul: 'L', aug: 'L', sep: 'L', oct: 'L', nov: 'L', dec: 'L' },
    { name: 'Membership Push', jan: 'M', feb: 'H', mar: 'H', apr: 'H', may: 'M', jun: 'M', jul: 'M', aug: 'M', sep: 'M', oct: 'M', nov: 'H', dec: 'H' },
    { name: 'Parties + Deposits', jan: 'M', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'M', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Monthly Flea Market', jan: 'H', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'Sponsor Skate Night', jan: 'H', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'GR: Sensory Skate weekly', jan: 'H', feb: 'H', mar: 'H', apr: 'H', may: 'H', jun: 'H', jul: 'H', aug: 'H', sep: 'H', oct: 'H', nov: 'H', dec: 'H' },
    { name: 'GR: Open Houses + Launch', jan: '-', feb: 'H', mar: 'H', apr: 'H', may: 'M', jun: 'M', jul: 'L', aug: '-', sep: '-', oct: '-', nov: '-', dec: '-' },
    { name: 'Grant Proof Capture', jan: 'M', feb: 'M', mar: 'M', apr: 'H', may: 'H', jun: 'H', jul: 'M', aug: 'M', sep: 'M', oct: 'M', nov: 'H', dec: 'H' },
  ]
};

const WEEKLY_CONTENT_CADENCE = [
  { day: 'Mon', shPost: 'Schedule + Prepay reminder', grPost: 'Impact story', votp: 'Yes', emailSms: 'Weekly "What\'s Up"', outreach: 'Sponsor follow-ups' },
  { day: 'Tue', shPost: 'Party spotlight', grPost: 'Program explainer', votp: 'Yes', emailSms: '—', outreach: 'School outreach' },
  { day: 'Wed', shPost: 'Merch highlight', grPost: 'Staff training', votp: 'Yes', emailSms: 'Mid-week flash offer', outreach: 'Grant contact' },
  { day: 'Thu', shPost: 'Sponsor invite', grPost: 'Sensory Skate promo', votp: 'Yes', emailSms: 'Sponsor email', outreach: 'Corporate calls' },
  { day: 'Fri', shPost: 'Weekend hype', grPost: 'Field trip highlight', votp: 'Yes', emailSms: 'Weekend reminder', outreach: 'Community orgs' },
  { day: 'Sat', shPost: 'Event coverage', grPost: 'Family wins', votp: 'Yes', emailSms: '—', outreach: 'On-site asks' },
  { day: 'Sun', shPost: 'Family recap', grPost: 'Sensory coverage', votp: 'Yes', emailSms: '—', outreach: '—' },
];

const KPI_TARGETS_INIT = [
  { month: 'Jan', shRev: 0, grFunding: 0, otherRev: 0, margin: 0.5 },
  { month: 'Feb', shRev: 0, grFunding: 0, otherRev: 0, margin: 0.5 },
  { month: 'Mar', shRev: 0, grFunding: 0, otherRev: 0, margin: 0.5 },
  { month: 'Apr', shRev: 0, grFunding: 0, otherRev: 0, margin: 0.5 },
  { month: 'May', shRev: 0, grFunding: 0, otherRev: 0, margin: 0.5 },
  { month: 'Jun', shRev: 0, grFunding: 0, otherRev: 0, margin: 0.5 },
];

const ALL_ROLE_TASKS = {
  receptionist: { title: '📞 Receptionist', daily: ['Check all inbound messages', 'Book appointments', 'Send intake forms', 'Tag leads'], weekly: ['Send reminders (48hr rule)', 'Lead report'], monthly: ['Clean database', 'Update FAQs'] },
  assistant: { title: '📋 Assistant', daily: ['Create Top 5', 'Assign tasks', 'Update calendar', 'Route urgent items'], weekly: ['Friday Scoreboard', '1-hour meeting', 'Update 12-month calendar'], monthly: ['Review systems', 'Update checklists'] },
  admin: { title: '📱 Admin (Hailey)', daily: ['Verify logs daily', 'Review AI outputs', 'Post content', 'Capture photos'], weekly: ['7-day content calendar', 'Weekly blast', 'Package for VOTP'], monthly: ['Review analytics', 'Plan themes'] },
  seo: { title: '🔍 SEO/Blog', daily: ['Check uptime', 'Monitor keywords'], weekly: ['1 blog (900-1200 words)', 'Update Google Business'], monthly: ['SEO audit', 'Backlink outreach'] },
  sales: { title: '💰 Sales', daily: ['Work pipeline', 'Send follow-ups', 'Schedule calls'], weekly: ['Pipeline report', 'Prep Rhonda', 'Upsell push'], monthly: ['Sponsor renewals', 'Build 50-target list'] },
  grants: { title: '📝 Grants', daily: ['Check deadlines', 'Draft applications', 'Send follow-ups'], weekly: ['WED: 8-hour block', 'Submit 2 grants', 'Update Tracker'], monthly: ['Pipeline review', 'Update Grant Kit'] },
  opsevents: { title: '🎉 Ops+Events (Kiarla)', daily: ['Facility check', 'Confirm staffing', 'Check equipment', 'Coordinate VOTP'], weekly: ['Open House planning', 'Event recap', 'Update calendar'], monthly: ['Flea market', 'Sponsor Skate Night', 'Quarterly bus'] },
  ops: { title: '⚙️ Ops (Pepper)', daily: ['Open rink on time', 'Enforce upsells', 'Log attendance', 'Capture photos'], weekly: ['Equipment status', 'Staff scheduling'], monthly: ['Facility improvements', 'Inventory check'] },
  votp: { title: '📺 VOTP (Phil)', daily: ['Review content', 'Coordinate posting', 'Capture media'], weekly: ['Receive pack (Thu 6pm)', 'Approve (Fri 1pm)', 'Post Saturday'], monthly: ['Media kit refresh', 'PR pitch list'] },
  legal: { title: '⚖️ Legal', daily: ['Review contracts'], weekly: ['Update templates', 'Flag risks'], monthly: ['Compliance audit', 'Policy updates'] },
  ceo: { title: '👑 CEO (Rhonda)', daily: ['Review Top 5 (10 min)', 'Approve items', 'Big calls ONLY'], weekly: ['1-hour meeting', 'Review Scoreboard', 'Sign off VOTP'], monthly: ['Approve themes', 'Review pipeline'] },
  owner: { title: '🏢 Owner (Chase)', daily: ['Dashboard review', 'Approve high-priority'], weekly: ['Strategy review', 'Money meeting', 'Closer calls'], monthly: ['Financial review', 'Strategic planning'] },
  ai_social: { title: '🤖 Sonny (AI)', daily: ['Draft social posts'], weekly: ['Generate ideas', 'A/B test hooks'], monthly: ['Analyze engagement'] },
  ai_seo: { title: '🤖 Penny (AI)', daily: ['Monitor rankings'], weekly: ['Update blogs', 'Keyword research'], monthly: ['SEO report'] },
  ai_inquiries: { title: '🤖 Rachel (AI)', daily: ['Handle inquiries', 'Route to humans'], weekly: ['Update FAQ responses'], monthly: ['Inquiry analysis'] },
};

// ============== REUSABLE COMPONENTS (OUTSIDE APP) ==============

// NumberInput - only saves on blur
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

// LogForm - completely separate component with its own state
const LogForm = ({ onAddLog }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [program, setProgram] = useState('SH');
  const [eventName, setEventName] = useState('');
  const [admissions, setAdmissions] = useState('');
  const [rentals, setRentals] = useState('');
  const [concessions, setConcessions] = useState('');
  const [uniqueVisitors, setUniqueVisitors] = useState('');
  const [membershipsSold, setMembershipsSold] = useState('');
  const [partyInquiries, setPartyInquiries] = useState('');
  const [partiesBooked, setPartiesBooked] = useState('');
  const [grFamilies, setGrFamilies] = useState('');
  const [grNewMembers, setGrNewMembers] = useState('');
  const [sponsorDollars, setSponsorDollars] = useState('');
  const [grantDollars, setGrantDollars] = useState('');
  const [sensoryAdaptive, setSensoryAdaptive] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    const logEntry = {
      date,
      program,
      eventName,
      admissions: parseInt(admissions) || 0,
      rentals: parseInt(rentals) || 0,
      concessions: parseInt(concessions) || 0,
      uniqueVisitors: parseInt(uniqueVisitors) || 0,
      membershipsSold: parseInt(membershipsSold) || 0,
      partyInquiries: parseInt(partyInquiries) || 0,
      partiesBooked: parseInt(partiesBooked) || 0,
      grFamilies: parseInt(grFamilies) || 0,
      grNewMembers: parseInt(grNewMembers) || 0,
      sponsorDollars: parseInt(sponsorDollars) || 0,
      grantDollars: parseInt(grantDollars) || 0,
      sensoryAdaptive,
      photosUploaded,
      notes,
    };
    
    if (logEntry.eventName || logEntry.admissions > 0) {
      await onAddLog(logEntry);
      // Reset form
      setEventName('');
      setAdmissions('');
      setRentals('');
      setConcessions('');
      setUniqueVisitors('');
      setMembershipsSold('');
      setPartyInquiries('');
      setPartiesBooked('');
      setGrFamilies('');
      setGrNewMembers('');
      setSponsorDollars('');
      setGrantDollars('');
      setSensoryAdaptive(false);
      setPhotosUploaded(false);
      setNotes('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-3">➕ Add Daily Log</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
        <div>
          <label className="text-xs font-medium">Date</label>
          <input type="date" className="w-full border rounded p-1" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium">Program</label>
          <select className="w-full border rounded p-1" value={program} onChange={e => setProgram(e.target.value)}>
            <option value="SH">SH</option>
            <option value="GR">GR</option>
            <option value="SL">SL</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium">Event Name</label>
          <input type="text" className="w-full border rounded p-1" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="e.g. Sensory Skate" />
        </div>
        <div>
          <label className="text-xs font-medium">Admissions $</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={admissions} onChange={e => setAdmissions(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Rentals $</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={rentals} onChange={e => setRentals(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Concessions $</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={concessions} onChange={e => setConcessions(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Unique Visitors</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={uniqueVisitors} onChange={e => setUniqueVisitors(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Memberships Sold</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={membershipsSold} onChange={e => setMembershipsSold(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Party Inquiries</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={partyInquiries} onChange={e => setPartyInquiries(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Parties Booked</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={partiesBooked} onChange={e => setPartiesBooked(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">GR Families</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={grFamilies} onChange={e => setGrFamilies(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">GR New Members</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={grNewMembers} onChange={e => setGrNewMembers(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Sponsor $</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={sponsorDollars} onChange={e => setSponsorDollars(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div>
          <label className="text-xs font-medium">Grant $</label>
          <input type="text" inputMode="numeric" className="w-full border rounded p-1" value={grantDollars} onChange={e => setGrantDollars(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={sensoryAdaptive} onChange={e => setSensoryAdaptive(e.target.checked)} /> Sensory?
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" checked={photosUploaded} onChange={e => setPhotosUploaded(e.target.checked)} /> Photos?
          </label>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium">Notes</label>
          <input type="text" className="w-full border rounded p-1" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div className="flex items-end">
          <button onClick={handleSubmit} className="w-full bg-green-600 text-white py-1 rounded font-bold hover:bg-green-700 flex items-center justify-center gap-1">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

// Login Screen
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
          <p className="text-gray-500">Passwords: [role]2026 (boss2026, owner2026...)</p>
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
  
  // Data states
  const [completedTasks, setCompletedTasks] = useState({});
  const [scoreboard, setScoreboard] = useState({
    sh: { admissions: 0, rentals: 0, concessions: 0, membershipsSold: 0, partiesBooked: 0 },
    gr: { families: 0, newMembers: 0, testimonials: 0 },
    sales: { contacted: 0, meetings: 0, sponsorDollars: 0 },
    grants: { submitted: 0, followUps: 0, grantDollars: 0 }
  });
  const [pipelines, setPipelines] = useState({
    grFamilies: { new: 0, contacted: 0, booked: 0, enrolled: 0, active: 0 },
    sponsors: { target: 0, contacted: 0, meeting: 0, proposal: 0, closed: 0 },
    grants: { research: 0, draft: 0, submitted: 0, followup: 0, won: 0, lost: 0 }
  });
  const [dailyLogs, setDailyLogs] = useState([]);
  const [contentPack, setContentPack] = useState(WEEKLY_CONTENT_CADENCE.map((item, i) => ({ ...item, id: i, status: 'Draft' })));
  const [kpiTargets, setKpiTargets] = useState(KPI_TARGETS_INIT);

  // Load data
  useEffect(() => {
    if (user) loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const { data: scoreboardData } = await supabase.from('scoreboard').select('*').single();
      if (scoreboardData?.data) setScoreboard(scoreboardData.data);

      const { data: pipelinesData } = await supabase.from('pipelines').select('*').single();
      if (pipelinesData?.data) setPipelines(pipelinesData.data);

      const { data: tasksData } = await supabase.from('tasks').select('*').single();
      if (tasksData?.data) setCompletedTasks(tasksData.data);

      const { data: contentData } = await supabase.from('content_pack').select('*').single();
      if (contentData?.data) setContentPack(contentData.data);

      const { data: kpiData } = await supabase.from('kpi_targets').select('*').single();
      if (kpiData?.data) setKpiTargets(kpiData.data);

      const { data: logsData } = await supabase.from('daily_logs').select('*').order('created_at', { ascending: false });
      if (logsData) setDailyLogs(logsData);
    } catch (error) {
      console.log('Loading...', error);
    }
    setLoading(false);
  };

  // Save functions
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
    await supabase.from('content_pack').upsert({ id: 1, data: newData });
  };

  const saveKpiTargets = async (newData) => {
    setKpiTargets(newData);
    setSaveStatus('Saving...');
    await supabase.from('kpi_targets').upsert({ id: 1, data: newData });
    setSaveStatus('Saved ✓');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const addLog = async (logEntry) => {
    const { data } = await supabase.from('daily_logs').insert({ ...logEntry, created_at: new Date().toISOString() }).select();
    if (data) {
      setDailyLogs(prev => [data[0], ...prev]);
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
  const canApproveContent = user.role === 'ceo' || user.role === 'owner' || user.role === 'votp' || user.role === 'ops';

  // Calculations
  const actualRevenue = (scoreboard.sh.admissions || 0) + (scoreboard.sh.rentals || 0) + (scoreboard.sh.concessions || 0);
  const actualSponsorDollars = scoreboard.sales.sponsorDollars || 0;
  const actualGrantDollars = scoreboard.grants.grantDollars || 0;
  const totalActual = actualRevenue + actualSponsorDollars + actualGrantDollars;
  const totalTarget = kpiTargets.reduce((sum, k) => sum + (k.shRev || 0) + (k.grFunding || 0) + (k.otherRev || 0), 0);
  const progressPercent = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : 0;

  // Helper components
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

  // ============== VIEWS ==============
  const DashboardView = () => (
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3">
        <p className="font-bold text-red-700">🚨 EMERGENCY: 1) Breathe 2) Text Rhonda 3) Log in Teams #01-Daily-Logs with URGENT</p>
      </div>
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 border-2 border-purple-300">
        <div className="flex justify-between items-start">
          <div><p className="text-xs text-purple-600 font-semibold">{CALENDAR_2026[selectedMonth].month}</p><h2 className="text-lg font-bold text-purple-800">{CALENDAR_2026[selectedMonth].theme}</h2></div>
          <div className="text-right text-xs"><p className="font-bold">${TARGETS.goals.skateHausMonthly.toLocaleString()}/mo SH</p><p className="font-bold text-purple-700">$6M GR by June</p></div>
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
        </div>
      </div>
    </div>
  );

  const SprintView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">🏃 February Sprint Map</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-800 text-white"><th className="p-2 text-left">Week</th><th className="p-2 text-left">Focus</th><th className="p-2 text-left">Actions</th><th className="p-2 text-left">Owner</th></tr></thead>
            <tbody>
              {SPRINT_MAP.map((s, i) => (
                <tr key={i} className="border-b"><td className="p-2 font-bold">{s.week}</td><td className="p-2"><span className="bg-purple-100 px-2 py-1 rounded">{s.focus}</span></td><td className="p-2">{s.actions}</td><td className="p-2 text-gray-600">{s.owner}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">❓ Weekly Review Questions</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {WEEKLY_REVIEW.map((r, i) => (<div key={i} className="bg-gray-50 p-3 rounded-lg"><p className="font-bold text-purple-700">{r.week}: {r.focus}</p><p className="text-sm text-gray-600">{r.questions}</p></div>))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📊 Dashboard Metrics</h2>
        <table className="w-full text-xs">
          <thead><tr className="bg-gray-100"><th className="p-2 text-left">Metric</th><th className="p-2 text-left">Formula</th><th className="p-2 text-left">Source</th><th className="p-2">Reviewer</th></tr></thead>
          <tbody>{DASHBOARD_METRICS.map((m, i) => (<tr key={i} className="border-b"><td className="p-2 font-medium">{m.metric}</td><td className="p-2 font-mono">{m.formula}</td><td className="p-2">{m.source}</td><td className="p-2">{m.reviewer}</td></tr>))}</tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">🧠 Sensory + STEM Concept</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {SENSORY_STEM_CONCEPT.map((c, i) => (<div key={i} className="bg-blue-50 p-3 rounded-lg"><p className="font-bold text-blue-700">{c.pillar}</p><p className="text-sm">{c.description}</p></div>))}
        </div>
      </div>
    </div>
  );

  const KpiView = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4">
        <h2 className="text-2xl font-bold">🎯 $6,000,000 Goal by June 30, 2026</h2>
        <div className="flex justify-between items-center mt-2">
          <p className="opacity-90">Actual vs Target</p>
          <div className="text-right"><p className="text-3xl font-bold">${totalActual.toLocaleString()}</p><p className="text-sm opacity-80">of ${totalTarget.toLocaleString()} ({progressPercent}%)</p></div>
        </div>
        <div className="mt-2 bg-white/20 rounded-full h-4 overflow-hidden"><div className="bg-white h-full" style={{width: `${Math.min(progressPercent, 100)}%`}}></div></div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📊 LIVE ACTUALS (from Scoreboard + Pipelines)</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="bg-purple-100 p-3 rounded-lg text-center border-2 border-purple-300"><p className="text-2xl font-bold text-purple-700">${actualRevenue.toLocaleString()}</p><p className="text-xs">SH Revenue</p></div>
          <div className="bg-green-100 p-3 rounded-lg text-center border-2 border-green-300"><p className="text-2xl font-bold text-green-700">${actualSponsorDollars.toLocaleString()}</p><p className="text-xs">Sponsor $</p></div>
          <div className="bg-yellow-100 p-3 rounded-lg text-center border-2 border-yellow-300"><p className="text-2xl font-bold text-yellow-700">${actualGrantDollars.toLocaleString()}</p><p className="text-xs">Grant $</p></div>
          <div className="bg-blue-100 p-3 rounded-lg text-center border-2 border-blue-300"><p className="text-2xl font-bold text-blue-700">{scoreboard.gr.families || 0}</p><p className="text-xs">GR Families</p></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📊 Jan-Jun TARGETS (type to edit, click out to save)</h3>
        <table className="w-full text-xs">
          <thead><tr className="bg-gray-100"><th className="p-2">Month</th><th className="p-2">SH Rev $</th><th className="p-2">GR Funding $</th><th className="p-2">Other $</th><th className="p-2">Total</th></tr></thead>
          <tbody>
            {kpiTargets.map((kpi, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 font-bold">{kpi.month}</td>
                <td className="p-1"><NumberInput value={kpi.shRev} onSave={(val) => { const n = [...kpiTargets]; n[i].shRev = val; saveKpiTargets(n); }} className="w-full" /></td>
                <td className="p-1"><NumberInput value={kpi.grFunding} onSave={(val) => { const n = [...kpiTargets]; n[i].grFunding = val; saveKpiTargets(n); }} className="w-full" /></td>
                <td className="p-1"><NumberInput value={kpi.otherRev} onSave={(val) => { const n = [...kpiTargets]; n[i].otherRev = val; saveKpiTargets(n); }} className="w-full" /></td>
                <td className="p-2 font-bold text-green-600">${((kpi.shRev || 0) + (kpi.grFunding || 0) + (kpi.otherRev || 0)).toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-gray-200 font-bold">
              <td className="p-2">TOTAL</td>
              <td className="p-2">${kpiTargets.reduce((s, k) => s + (k.shRev || 0), 0).toLocaleString()}</td>
              <td className="p-2">${kpiTargets.reduce((s, k) => s + (k.grFunding || 0), 0).toLocaleString()}</td>
              <td className="p-2">${kpiTargets.reduce((s, k) => s + (k.otherRev || 0), 0).toLocaleString()}</td>
              <td className="p-2 text-green-700">${totalTarget.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

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
            <div><h3 className="font-bold text-purple-700 mb-2">🛒 Offers</h3><div className="flex flex-wrap gap-1">{CALENDAR_2026[selectedMonth].primaryOffers.map((o, i) => <span key={i} className="bg-purple-100 px-2 py-1 rounded text-xs">{o}</span>)}</div></div>
            <div><h3 className="font-bold text-blue-700 mb-2">🎉 Events</h3><ul className="text-sm space-y-1">{CALENDAR_2026[selectedMonth].keyEvents.map((e, i) => <li key={i}>• {e}</li>)}</ul></div>
            <div><h3 className="font-bold text-green-700 mb-2">📱 Content</h3><div className="flex flex-wrap gap-1">{CALENDAR_2026[selectedMonth].contentPillars.map((c, i) => <span key={i} className="bg-green-100 px-2 py-1 rounded text-xs">{c}</span>)}</div></div>
            <div><h3 className="font-bold text-yellow-700 mb-2">📝 Grants</h3><ul className="text-sm">{CALENDAR_2026[selectedMonth].grantActions.map((g, i) => <li key={i}>• {g}</li>)}</ul></div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3">📅 {CALENDAR_2026[selectedMonth].month} Events</h3>
        {(() => {
          const monthNum = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(selectedMonth) + 1;
          const monthStr = monthNum.toString().padStart(2, '0');
          const filtered = CALENDAR_EVENTS.filter(ev => ev.date.includes(`-${monthStr}-`));
          return filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events scheduled for this month.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">{ev.date}</span>
                  <span className="bg-blue-100 text-xs px-2 py-1 rounded">{ev.org}</span>
                  <span className="font-medium">{ev.title}</span>
                  <span className="text-gray-500 text-sm flex-1">{ev.details}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );

  const GanttView = () => (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">📊 2026 Campaign Gantt</h2>
      <p className="text-xs text-gray-500 mb-3">H = High | M = Medium | L = Low | - = Not active</p>
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

  const ContentView = () => (
    <div className="space-y-4">
      <div className="bg-red-100 border-2 border-red-400 p-3 rounded-xl text-center">
        <p className="font-bold text-red-700 text-lg">⚠️ NOTHING POSTS UNTIL APPROVED ⚠️</p>
        <p className="text-sm text-red-600">Thu 6pm submit → Fri 1pm approve → Sat post</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📅 Weekly Content Cadence</h2>
        <table className="w-full text-xs">
          <thead><tr className="bg-gray-800 text-white"><th className="p-2">Day</th><th className="p-2">SH Post</th><th className="p-2">GR Post</th><th className="p-2">Email/SMS</th><th className="p-2">Outreach</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {contentPack.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-2 font-bold">{item.day}</td>
                <td className="p-2">{item.shPost}</td>
                <td className="p-2">{item.grPost}</td>
                <td className="p-2">{item.emailSms}</td>
                <td className="p-2">{item.outreach}</td>
                <td className="p-2 text-center"><button onClick={() => canApproveContent && cycleContentStatus(item.id)} disabled={!canApproveContent} className={canApproveContent ? 'cursor-pointer' : 'opacity-50'}><StatusBadge status={item.status} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const LogsView = () => (
    <div className="space-y-4">
      <div className="bg-yellow-100 border-2 border-yellow-400 p-3 rounded-xl">
        <p className="font-bold text-yellow-800">📝 RULE: If it's not logged, it didn't happen → Teams #01-Daily-Logs</p>
      </div>
      <LogForm onAddLog={addLog} />
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-3">📋 Logs ({dailyLogs.length})</h2>
        {dailyLogs.length === 0 ? <p className="text-gray-500 text-center py-4">No logs yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-100"><th className="p-1">Date</th><th className="p-1">Prog</th><th className="p-1">Event</th><th className="p-1">Adm$</th><th className="p-1">Rent$</th><th className="p-1">GR Fam</th><th className="p-1">Spons$</th><th className="p-1">Grant$</th><th className="p-1"></th></tr></thead>
              <tbody>
                {dailyLogs.slice(0, 20).map(log => (
                  <tr key={log.id} className="border-b">
                    <td className="p-1">{log.date}</td>
                    <td className="p-1 font-bold">{log.program}</td>
                    <td className="p-1">{log.eventName}</td>
                    <td className="p-1">${log.admissions || 0}</td>
                    <td className="p-1">${log.rentals || 0}</td>
                    <td className="p-1">{log.grFamilies || 0}</td>
                    <td className="p-1">${log.sponsorDollars || 0}</td>
                    <td className="p-1">${log.grantDollars || 0}</td>
                    <td className="p-1"><button onClick={() => deleteLog(log.id)} className="text-red-500 hover:text-red-700"><Trash2 size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

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
        {activeTab === 'content' && <ContentView />}
        {activeTab === 'logs' && <LogsView />}
        {activeTab === 'team' && <TeamView />}
      </div>
    </div>
  );
}

export default App;
