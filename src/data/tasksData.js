export const INITIAL_TASKS = [
  {
    id: 'task-1',
    task: 'Automated GitHub PR Code Audit',
    description: 'Scans new open PRs in samrudh-dev/brahma-app for security, performance, and code smell.',
    schedule: 'Every 6 hours',
    nextRun: 'Today, 22:00',
    lastRun: 'Today, 16:00 (Pass)',
    status: 'ACTIVE',
    identityId: 'shiva',
    connectedServices: ['GitHub']
  },
  {
    id: 'task-2',
    task: 'Anytype Knowledge Graph Indexer',
    description: 'Indexes newly created Anytype objects and links them into project context graph.',
    schedule: 'Daily at 08:00',
    nextRun: 'Tomorrow, 08:00',
    lastRun: 'Today, 08:00 (Success)',
    status: 'ACTIVE',
    identityId: 'surya',
    connectedServices: ['Anytype', 'Google Drive']
  },
  {
    id: 'task-3',
    task: 'System Health & Vulnerability Scan',
    description: 'Verifies dependency vulnerabilities and checks system security policies.',
    schedule: 'Weekly on Monday',
    nextRun: 'Sep 28, 00:00',
    lastRun: 'Sep 21, 00:00 (Clean)',
    status: 'ACTIVE',
    identityId: 'durga',
    connectedServices: ['GitHub']
  },
  {
    id: 'task-4',
    task: 'Daily Financial & Compute Cost Report',
    description: 'Aggregates API token expenditures, cloud runtime hours, and resource utilization metrics.',
    schedule: 'Daily at 23:59',
    nextRun: 'Today, 23:59',
    lastRun: 'Yesterday, 23:59',
    status: 'PAUSED',
    identityId: 'lakshmi',
    connectedServices: ['Google Drive']
  }
];
