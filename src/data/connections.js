export const CONNECTION_STATUSES = {
  CONNECTED: 'CONNECTED',
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTING: 'CONNECTING',
  ERROR: 'ERROR',
  REAUTH_REQUIRED: 'REAUTH_REQUIRED'
};

export const INITIAL_CONNECTIONS = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'Development & Version Control',
    icon: 'Github',
    status: CONNECTION_STATUSES.CONNECTED,
    account: 'samrudh-dev',
    lastSync: '2 minutes ago',
    capabilities: [
      'Review latest Pull Requests',
      'Summarize daily commits',
      'Explain repository architecture',
      'Detect likely bugs & security flaws',
      'Summarize open issues & triage',
      'Create GitHub Issues & PR comments',
      'Analyze branch diffs'
    ],
    isFirstClass: true,
    authType: 'OAuth2 / Personal Access Token',
    adapterType: 'Real Integration Adapter',
    meta: { repos: 14, orgs: ['Brahma-AI'], scope: 'repo, workflow, read:user' }
  },
  {
    id: 'anytype',
    name: 'Anytype',
    category: 'Knowledge & Notes Graph',
    icon: 'BookOpen',
    status: CONNECTION_STATUSES.CONNECTED,
    account: 'Samrudh Vault',
    lastSync: '10 minutes ago',
    capabilities: [
      'Search knowledge graph notes',
      'Read objects & collections',
      'Summarize personal knowledge vault',
      'Find project reference information',
      'Turn raw notes into actionable plans',
      'Create structured Anytype objects'
    ],
    isFirstClass: true,
    authType: 'Local gRPC / Anytype API Key',
    adapterType: 'Real Local Adapter',
    meta: { spaces: 3, totalObjects: 412, vaultStatus: 'Synced' }
  },
  {
    id: 'gdrive',
    name: 'Google Drive',
    category: 'Cloud Storage & Documents',
    icon: 'HardDrive',
    status: CONNECTION_STATUSES.CONNECTED,
    account: 'samrudh@workspace.ai',
    lastSync: '1 hour ago',
    capabilities: [
      'Read & process Google Docs / Sheets / PDFs',
      'Index project documentation',
      'Export generated reports to Drive',
      'Search workspace files'
    ],
    isFirstClass: true,
    authType: 'Google OAuth2',
    adapterType: 'Real Google Cloud Adapter',
    meta: { quotaUsed: '4.2 GB / 100 GB', activeSyncFolders: ['Brahma_Docs', 'Research'] }
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    icon: 'Mail',
    status: CONNECTION_STATUSES.NOT_CONNECTED,
    account: null,
    lastSync: 'Never',
    capabilities: [
      'Draft priority email responses',
      'Summarize long email threads',
      'Extract action items from inbox',
      'Send scheduled reports via email'
    ],
    isFirstClass: true,
    authType: 'Google OAuth2 (Restricted Scope)',
    adapterType: 'OAuth Ready',
    meta: { requiresUserConsent: true }
  },
  {
    id: 'gcalendar',
    name: 'Google Calendar',
    category: 'Schedule & Time Management',
    icon: 'Calendar',
    status: CONNECTION_STATUSES.NOT_CONNECTED,
    account: null,
    lastSync: 'Never',
    capabilities: [
      'Sync scheduled AI automation tasks',
      'Find open focus time slots',
      'Create meeting agendas & reminders',
      'Track deadline schedules'
    ],
    isFirstClass: true,
    authType: 'Google OAuth2',
    adapterType: 'OAuth Ready',
    meta: { requiresUserConsent: true }
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Team Communication',
    icon: 'MessageSquare',
    status: CONNECTION_STATUSES.NOT_CONNECTED,
    account: null,
    lastSync: 'Never',
    capabilities: ['Channel summaries', 'Post AI updates', 'Bot trigger commands'],
    isFirstClass: false,
    authType: 'Slack Bot Token',
    adapterType: 'Plugin Adapter'
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'Project Management',
    icon: 'CheckSquare',
    status: CONNECTION_STATUSES.REAUTH_REQUIRED,
    account: 'samrudh@linear',
    lastSync: '3 days ago (Token Expired)',
    capabilities: ['Issue tracking sync', 'Create linear tickets', 'Sprint progress analysis'],
    isFirstClass: false,
    authType: 'Linear API Key',
    adapterType: 'Plugin Adapter'
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'Design & UI/UX',
    icon: 'Figma',
    status: CONNECTION_STATUSES.NOT_CONNECTED,
    account: null,
    lastSync: 'Never',
    capabilities: ['Inspect design tokens', 'Extract component specs', 'Generate React UI code'],
    isFirstClass: false,
    authType: 'Figma Personal Token',
    adapterType: 'Plugin Adapter'
  }
];
