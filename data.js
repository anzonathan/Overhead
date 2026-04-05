// Overhead AI — Static Data Layer
// All user profile, goal tree, schedule data lives here.

export const USER_PROFILE = {
  name: "User",
  location: "Kampala, Uganda",
  university: "UCU",
  year: "CS Undergraduate",
  season: "Exam prep, final year approaching",
  timezone: "EAT (UTC+3)",
};

export const LIFE_AREAS = [
  {
    id: "spiritual",
    label: "Spiritual",
    icon: "✦",
    color: "#f59e0b",
    goals: [
      { id: "s1", text: "Daily devotions — Proverbs + Isaiah 60 + TBIOY", status: "ACTIVE", priority: 1 },
      { id: "s2", text: "Sabbath weekly (24hr rest)", status: "ACTIVE", priority: 2 },
      { id: "s3", text: "Consistent chapel + Pacesetters service", status: "ACTIVE", priority: 3 },
    ],
  },
  {
    id: "ministry",
    label: "Ministry",
    icon: "◈",
    color: "#8b5cf6",
    goals: [
      { id: "m1", text: "b6e — EPD (LLM report, Pv2, migrate, analytics), GTM, Foundation", status: "ACTIVE", priority: 4, badge: "HIGH" },
      { id: "m2", text: "CSEA SWE chapter — semester plan, Discord bot, Code Challenge platform", status: "ACTIVE", priority: 5, badge: "HIGH" },
      { id: "m3", text: "The Moon MVP", status: "ACTIVE", priority: 6, badge: "HIGH" },
      { id: "m4", text: "Novice (UCU learning platform)", status: "ACTIVE", priority: 7 },
      { id: "m5", text: "Lidri — convention + website + blog", status: "ACTIVE", priority: 8 },
      { id: "m6", text: "Moments — social, gigs, album pipeline", status: "ACTIVE", priority: 9 },
    ],
  },
  {
    id: "intellectual",
    label: "Intellectual",
    icon: "◉",
    color: "#60a5fa",
    goals: [
      { id: "i1", text: "Final Year Project — Hive Mind Framework / AI HW Optimization", status: "ACTIVE", priority: 10, badge: "HIGH" },
      { id: "i2", text: "IBM internship / Singapore application", status: "ACTIVE", priority: 11, badge: "HIGH" },
      { id: "i3", text: "Legal docs — Passport + Driver's Permit + Birth Certificate", status: "ACTIVE", priority: 12, badge: "HIGH" },
      { id: "i4", text: "Ship personal website", status: "ACTIVE", priority: 13 },
      { id: "i5", text: "OSS contributions — Django, Musescore, BeeAI", status: "ACTIVE", priority: 14 },
      { id: "i6", text: "Build Home Lab", status: "PLANNING", priority: 15 },
      { id: "i7", text: "NeoVim + Arch Linux migration", status: "ACTIVE", priority: 16 },
      { id: "i8", text: "Piano — structured routine + repertoire", status: "ACTIVE", priority: 17 },
      { id: "i9", text: "Read 20 books this year", status: "ACTIVE", priority: 18 },
    ],
  },
  {
    id: "health",
    label: "Health",
    icon: "◎",
    color: "#34d399",
    goals: [
      { id: "h1", text: "Calisthenics habit (Tue/Wed/Sat)", status: "ACTIVE", priority: 19 },
    ],
  },
  {
    id: "relational",
    label: "Relational",
    icon: "◇",
    color: "#f472b6",
    goals: [
      { id: "r1", text: "Weekly calls — Jeremiah, Chipo, Rutiba, Makumbi", status: "ACTIVE", priority: 20 },
      { id: "r2", text: "Choir, family time", status: "ACTIVE", priority: 21 },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    icon: "◆",
    color: "#fbbf24",
    goals: [
      { id: "f1", text: "Always on a written budget", status: "ACTIVE", priority: 22, badge: "NON-NEG" },
      { id: "f2", text: "6-month emergency fund", status: "ACTIVE", priority: 23 },
    ],
  },
];

export const ACTIVE_PROJECTS = [
  { name: "The Moon", stack: "Django + Next.js", priority: 1, status: "active" },
  { name: "Novice", stack: "Django + Next.js + Neon", priority: 1, status: "active" },
  { name: "Overhead", stack: "Flask + HTML/JS", priority: 1, status: "active" },
  { name: "QuickTask/Keyo", stack: "DRF + Next.js", priority: 1, status: "active" },
  { name: "CSEA Workflow", stack: "auth, payment, calendar", priority: 1, status: "active" },
  { name: "Final Year Project", stack: "Hive Mind Framework", priority: 1, status: "active" },
  { name: "CSEA Discord Bot", stack: "Discord API", priority: 2, status: "active" },
  { name: "Personal Website", stack: "Next.js + MDX", priority: 2, status: "active" },
  { name: "Lidri", stack: "website + convention", priority: 2, status: "active" },
  { name: "Renaissance", stack: "music archive", priority: 2, status: "active" },
  { name: "Hardware Dashboard", stack: "ESP32", priority: 3, status: "active" },
];

export const WEEKLY_RHYTHM = {
  MON: [
    { time: "04:30", title: "Devotions", type: "spiritual", fixed: true },
    { time: "05:10", title: "Hygiene + clean spaces", type: "health", fixed: true },
    { time: "05:30", title: "Inspo block", type: "deep-work", fixed: true },
    { time: "07:00", title: "b6e block", type: "ministry", fixed: true },
    { time: "21:40", title: "Piano practice", type: "creative", fixed: true },
    { time: "22:30", title: "Wind-down → sleep", type: "rest", fixed: true },
  ],
  TUE: [
    { time: "04:30", title: "Devotions", type: "spiritual", fixed: true },
    { time: "05:10", title: "Hygiene + clean spaces", type: "health", fixed: true },
    { time: "05:30", title: "Inspo block", type: "deep-work", fixed: true },
    { time: "07:00", title: "b6e block", type: "ministry", fixed: true },
    { time: "21:40", title: "Piano practice", type: "creative", fixed: true },
    { time: "22:30", title: "Wind-down → sleep", type: "rest", fixed: true },
  ],
  WED: [
    { time: "04:30", title: "Devotions", type: "spiritual", fixed: true },
    { time: "05:10", title: "Hygiene + clean spaces", type: "health", fixed: true },
    { time: "05:30", title: "Inspo block", type: "deep-work", fixed: true },
    { time: "07:00", title: "b6e block", type: "ministry", fixed: true },
    { time: "15:00", title: "CSEA / SWE", type: "ministry", fixed: true },
    { time: "16:30", title: "SWE Chapter Meet", type: "ministry", fixed: true },
    { time: "18:20", title: "Cell group", type: "spiritual", fixed: true, nonNeg: true },
    { time: "21:40", title: "Piano practice", type: "creative", fixed: true },
    { time: "22:30", title: "Wind-down → sleep", type: "rest", fixed: true },
  ],
  THU: [
    { time: "04:30", title: "Devotions", type: "spiritual", fixed: true },
    { time: "05:10", title: "Hygiene + clean spaces", type: "health", fixed: true },
    { time: "05:30", title: "Inspo block", type: "deep-work", fixed: true },
    { time: "07:00", title: "b6e block", type: "ministry", fixed: true },
    { time: "21:40", title: "Piano practice", type: "creative", fixed: true },
    { time: "22:30", title: "Wind-down → sleep", type: "rest", fixed: true },
  ],
  FRI: [
    { time: "04:30", title: "Devotions", type: "spiritual", fixed: true },
    { time: "05:10", title: "Hygiene + clean spaces", type: "health", fixed: true },
    { time: "05:30", title: "Inspo block", type: "deep-work", fixed: true },
    { time: "07:00", title: "b6e block", type: "ministry", fixed: true },
    { time: "21:40", title: "Piano practice", type: "creative", fixed: true },
    { time: "22:30", title: "Wind-down → sleep", type: "rest", fixed: true },
  ],
  SAT: [
    { time: "ALL DAY", title: "SABBATH — Full rest", type: "sabbath", fixed: true, nonNeg: true },
    { time: "morning", title: "Calisthenics", type: "health", fixed: true },
    { time: "morning", title: "Laundry + errands", type: "personal", fixed: true },
  ],
  SUN: [
    { time: "04:30", title: "Devotions", type: "spiritual", fixed: true },
    { time: "morning", title: "Church + family", type: "spiritual", fixed: true, nonNeg: true },
    { time: "afternoon", title: "Reading / light work", type: "intellectual", fixed: false },
  ],
};

export const NON_NEGOTIABLES = [
  { label: "Sabbath", detail: "Saturday — no tasks, no code, no planning", days: ["SAT"] },
  { label: "Sleep", detail: "23:00–04:30 — sacred", days: ["MON","TUE","WED","THU","FRI","SAT","SUN"] },
  { label: "Church", detail: "Sunday morning — non-negotiable", days: ["SUN"] },
  { label: "Cell group", detail: "Wednesday 18:20–21:20", days: ["WED"] },
  { label: "Devotions", detail: "04:30–05:10 — immovable anchor", days: ["MON","TUE","WED","THU","FRI","SUN"] },
];

export const DEEP_WORK_WINDOWS = [
  { label: "Inspo + Planning", time: "05:30–07:00", days: "Mon–Fri", protect: true },
  { label: "Deep focus", time: "10:00–13:00", days: "Mon–Fri", protect: true, note: "Best cognitive window — never fragment with admin" },
  { label: "Piano / Creative", time: "21:40–22:30", days: "Mon–Fri", protect: true, note: "Restorative, not productive" },
];

export const LEARNING_STACK = [
  "Next.js", "DRF", "Django (deep)", "PyTorch", "Google Calendar API", "Discord API",
  "Linear Algebra (Ch 1–3)", "IBM Python for DataScience", "IBM AI Fundamentals",
  "NeoVim", "Tmux",
];

export const ACTIVE_READING = [
  { title: "Elon Musk", author: "Walter Isaacson", status: "in progress" },
  { title: "Atomic Habits", author: "James Clear", status: "queued" },
];

export const SUGGESTED_PROMPTS = [
  { label: "Triage today", prompt: "Run a triage for today, Sunday April 6 2026. What should I actually do?" },
  { label: "Wednesday overload", prompt: "My Wednesday looks overloaded again. Help me triage." },
  { label: "Weekly review", prompt: "Give me a weekly review for the week of April 5–11, 2026." },
  { label: "Goal check", prompt: "Which of my annual goals are structurally at risk given my current load?" },
];
