export type TaskState = 'To Do' | 'In Progress' | 'Blocked' | 'Done';
export type TaskFilter = 'All' | TaskState;
export type MemberFilter = 'Everyone' | 'Inky' | 'Tina' | 'AI Agents' | 'Team';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type LogLevel = 'INFO' | 'ACTION' | 'WARN' | 'DONE';
export type ProjectStatus = 'ACTIVE' | 'DEPLOYING' | 'PLANNING' | 'REVIEW' | 'PAUSED';
export type ProjectCategory = 'AI System' | 'Product' | 'Content Pipeline' | 'Infrastructure' | 'Research';

export type Agent = {
  name: string;
  role: string;
  color: string;
  signal: string;
  kind: 'ai' | 'human' | 'team';
};

export type Task = {
  id: string;
  title: string;
  path: string;
  instructions: string;
  context: string;
  state: TaskState;
  owner: string;
  priority: Priority;
  sync: string;
  eta: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type LogEntry = {
  id: number;
  time: string;
  actor: string;
  level: LogLevel;
  area: string;
  message: string;
  source: string;
  createdAt?: string;
};

export type SettingGroup = {
  id: string;
  title: string;
  status: 'Configured' | 'Planned' | 'Active';
  items: string[];
  updatedAt?: string;
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  category: ProjectCategory;
  progress: number;
  created: string;
  repo: string;
  route: string;
  summary: string;
  agents: string[];
  pipelines: string[];
  metrics: Array<[string, string]>;
  activity: string;
  updatedAt?: string;
};

export const AGENTS: Agent[] = [
  { name: 'SkyNode', role: 'Chief of Staff AI', color: '#22d3ee', signal: 'ONLINE', kind: 'ai' },
  { name: 'Inky', role: 'AI Product Builder', color: '#fb7185', signal: 'ONLINE', kind: 'ai' },
  { name: 'Tina', role: 'Human Team', color: '#f8fafc', signal: 'LIVE', kind: 'human' },
  { name: 'Ops Team', role: 'Shared Queue', color: '#38bdf8', signal: 'SYNC', kind: 'team' },
];

export const COLUMNS: TaskState[] = ['To Do', 'In Progress', 'Blocked', 'Done'];
export const FILTERS: TaskFilter[] = ['All', ...COLUMNS];
export const MEMBER_FILTERS: MemberFilter[] = ['Everyone', 'Inky', 'Tina', 'AI Agents', 'Team'];

export const SEED_TASKS: Task[] = [
  {
    id: 'MC-201',
    title: 'Turn Visual into a live Ops Map',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control/src/app/visual/page.tsx',
    instructions: 'Connect the visual wall map to persisted task and agent state.',
    context: 'Guillermo defined Visual as task cards on a wall with 8-bit agents moving toward active work.',
    state: 'In Progress',
    owner: 'SkyNode',
    priority: 'High',
    sync: 'Reading from MySQL-backed task state',
    eta: '18m',
    tags: ['visual', 'ops-map', 'mysql'],
  },
  {
    id: 'MC-202',
    title: 'Persist Tasks in MySQL',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control/src/app/api/tasks',
    instructions: 'Create API routes for listing, creating and updating task state.',
    context: 'This is the first Core Backend step to move Mission Control toward 8/10.',
    state: 'In Progress',
    owner: 'SkyNode',
    priority: 'Critical',
    sync: 'MySQL mission_control database',
    eta: '12m',
    tags: ['backend', 'api', 'tasks'],
  },
  {
    id: 'MC-203',
    title: 'Create operational log stream',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control/src/app/api/logs',
    instructions: 'Write important UI and API actions into a persistent audit trail.',
    context: 'Logs should stop being static UI copy and become a real operational record.',
    state: 'To Do',
    owner: 'Ops Team',
    priority: 'High',
    sync: 'Log entries persisted on task changes',
    eta: '20m',
    tags: ['logs', 'audit', 'operations'],
  },
  {
    id: 'MC-204',
    title: 'Build universal side detail pattern',
    path: '/home/ubuntu/.openclaw/workspace/projects/mission-control/src/app/tasks/page.tsx',
    instructions: 'Clicking a task should open a right-side detail panel with state controls and metadata.',
    context: 'The same pattern can later be reused by Docs, Memory, Projects, Logs and Agents.',
    state: 'To Do',
    owner: 'Inky',
    priority: 'Medium',
    sync: 'Client state backed by API refresh',
    eta: '24m',
    tags: ['detail-panel', 'ux'],
  },
  {
    id: 'MC-130',
    title: 'Resolve external credential scope',
    path: '/home/ubuntu/.openclaw/workspace/.env.local',
    instructions: 'Confirm which external APIs can be used by agents from Mission Control.',
    context: 'Blocked until Guillermo approves specific external service scopes.',
    state: 'Blocked',
    owner: 'Tina',
    priority: 'High',
    sync: 'Blocked on access approval',
    eta: '--',
    tags: ['security', 'access'],
  },
  {
    id: 'MC-099',
    title: 'Archive completed mission logs',
    path: '/home/ubuntu/.openclaw/workspace/logs/mission-control',
    instructions: 'Keep completed mission traces indexed and visible in the audit trail.',
    context: 'Daily cleanup after Mission Control deployment work.',
    state: 'Done',
    owner: 'Ops Team',
    priority: 'Low',
    sync: 'Replicated to persistent log table',
    eta: 'done',
    tags: ['logs', 'archive'],
  },
];

export const SEED_LOGS: Omit<LogEntry, 'id'>[] = [
  {
    time: '11:57',
    actor: 'Guillermo',
    level: 'ACTION',
    area: 'Backend',
    message: 'Authorized using the installed MySQL server for Mission Control Core Backend.',
    source: 'telegram:654',
  },
  {
    time: '11:28',
    actor: 'SkyNode',
    level: 'INFO',
    area: 'Roadmap',
    message: 'Defined the 8/10 plan: persistence, API, real actions, logs and Ops Map state.',
    source: 'telegram:650',
  },
  {
    time: '11:14',
    actor: 'SkyNode',
    level: 'DONE',
    area: 'Visual',
    message: 'Implemented Live Operations Map with task nodes and animated 8-bit agents.',
    source: 'commit:4340f8a',
  },
];

export const SEED_SETTINGS: SettingGroup[] = [
  {
    id: 'telegram-voice',
    title: 'Telegram + Voice',
    status: 'Configured',
    items: ['Text response first', 'Voice note delivery', 'es-MX-JorgeNeural', '1.8x playback preference'],
  },
  {
    id: 'ai-runtime',
    title: 'AI Runtime',
    status: 'Planned',
    items: ['Model selection', 'agent tool scopes', 'memory injection rules', 'workflow permissions'],
  },
  {
    id: 'workspace',
    title: 'Workspace',
    status: 'Configured',
    items: ['projects/ as permanent workspace', 'media-out/ as temporary output', 'memory files as continuity layer'],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    status: 'Planned',
    items: ['GitHub', 'OpenClaw Gateway', 'Cloudflare tunnel', 'future vector database'],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'mission-control',
    name: 'Mission Control',
    status: 'DEPLOYING',
    category: 'AI System',
    progress: 82,
    created: '2026-05-24',
    repo: 'github.com/jesustorres-code/mission-control',
    route: '/home/ubuntu/.openclaw/workspace/projects/mission-control',
    summary: 'AI-native operations dashboard with MySQL-backed tasks, logs, settings and live operational views.',
    agents: ['SkyNode', 'Inky', 'Ops Team', 'Watchlist Engine'],
    pipelines: ['task registry', 'content scoring', 'scheduler runtime', 'public deploy'],
    metrics: [['backend', 'mysql'], ['routes live', '12'], ['status', '200']],
    activity: 'Core backend phase is wiring persistent data and real actions into the dashboard.',
  },
  {
    id: 'shazam-popular-segments',
    name: 'Shazam Popular Segments',
    status: 'ACTIVE',
    category: 'Product',
    progress: 84,
    created: '2026-05-17',
    repo: 'local git project',
    route: '/home/ubuntu/.openclaw/workspace/projects/shazam-popular-segments',
    summary: 'Audio intelligence system for creating song cases, extracting popular clips, testing providers, and serving a browser interface through Apache.',
    agents: ['SkyNode', 'Ops Team'],
    pipelines: ['clip extraction', 'provider previews', 'case generation', 'Apache route'],
    metrics: [['public route', '/shazam'], ['api port', '8000'], ['health', 'online']],
    activity: 'Service is running locally behind Apache on the public /shazam route.',
  },
  {
    id: 'rpd-12-terraview',
    name: 'RPD-12 TerraView',
    status: 'REVIEW',
    category: 'Research',
    progress: 63,
    created: '2026-05-21',
    repo: 'static workspace prototype',
    route: '/home/ubuntu/.openclaw/workspace/projects/rpd-12-terraview',
    summary: 'Civic intelligence prototype for territorial dashboards, Oaxaca map visualization, sentiment/risk overlays, alert center and exportable data.',
    agents: ['SkyNode', 'Watchlist Engine'],
    pipelines: ['map visualization', 'risk scoring', 'narrative analysis', 'CSV export'],
    metrics: [['tunnel history', 'active recently'], ['map asset', 'ready'], ['mode', 'demo']],
    activity: 'Prototype has assets and a Cloudflare demo history; ready for product hardening.',
  },
  {
    id: 'openclaw-ops-workspace',
    name: 'OpenClaw Ops Workspace',
    status: 'ACTIVE',
    category: 'Infrastructure',
    progress: 69,
    created: '2026-05-16',
    repo: '/home/ubuntu/.openclaw/workspace',
    route: '/home/ubuntu/.openclaw/workspace',
    summary: 'Operational home for memory, voice replies, Telegram workflows, dashboard reverse proxy notes, temporary media and agent continuity.',
    agents: ['SkyNode'],
    pipelines: ['memory capture', 'voice reply', 'service notes', 'heartbeat readiness'],
    metrics: [['voice', 'enabled'], ['timezone', 'CST'], ['dashboard', 'proxied']],
    activity: 'Maintains Guillermo’s preferences, TTS setup, project locations, and service URLs.',
  },
];
