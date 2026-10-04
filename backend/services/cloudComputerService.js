/**
 * BRAHMA Sovereign Cloud Computer & 24/7 Autonomous Remote Worker Engine
 * Manages headless cloud runners, detached background task queues, and multi-cloud configurations
 * (Hugging Face Spaces, GitHub Actions 24/7 Cron Runner, Render, Termux Android Node).
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');
const crypto = require('crypto');

class CloudComputerService {
  constructor() {
    this.storageDir = path.join(__dirname, '../../.brahma/cloud_tasks');
    this.ensureStorage();
    this.activeTasks = new Map();
    this.taskHistoryLimit = 50;
  }

  ensureStorage() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  /**
   * Detect currently running cloud environment
   */
  detectPlatform() {
    if (process.env.SPACE_ID || process.env.HF_SPACE_ID) {
      return {
        platform: 'Hugging Face Spaces',
        tier: 'Free 2 vCPU / 16 GB RAM (24/7 Always-On)',
        isCloud: true,
        spaceId: process.env.SPACE_ID || process.env.HF_SPACE_ID
      };
    }
    if (process.env.GITHUB_ACTIONS) {
      return {
        platform: 'GitHub Actions Cloud Runner',
        tier: 'Free 2-Core / 7 GB RAM Ephemeral Runner',
        isCloud: true,
        workflow: process.env.GITHUB_WORKFLOW || 'Cloud Runner'
      };
    }
    if (process.env.RENDER) {
      return {
        platform: 'Render Cloud Web Service',
        tier: 'Free Container Tier',
        isCloud: true,
        serviceId: process.env.RENDER_SERVICE_ID || 'render_svc'
      };
    }
    if (process.env.FLY_ALLOC_ID) {
      return {
        platform: 'Fly.io Cloud MicroVM',
        tier: 'Free MicroVM',
        isCloud: true,
        region: process.env.FLY_REGION || 'global'
      };
    }
    return {
      platform: 'Local Sovereign Bastion',
      tier: 'Local Workstation Hardware',
      isCloud: false,
      hostname: os.hostname()
    };
  }

  /**
   * Get Real-time Cloud Telemetry
   */
  getTelemetry() {
    const platformInfo = this.detectPlatform();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpus = os.cpus() || [];

    return {
      success: true,
      timestamp: new Date().toISOString(),
      platform: platformInfo,
      uptimeSeconds: Math.floor(process.uptime()),
      systemUptimeSeconds: Math.floor(os.uptime()),
      cpu: {
        model: cpus[0]?.model || 'Cloud vCPU',
        cores: cpus.length,
        loadAvg: os.loadavg ? os.loadavg() : [0, 0, 0]
      },
      memory: {
        totalMb: Math.round(totalMem / (1024 * 1024)),
        usedMb: Math.round(usedMem / (1024 * 1024)),
        freeMb: Math.round(freeMem / (1024 * 1024)),
        usagePercent: +((usedMem / totalMem) * 100).toFixed(1)
      },
      processMemory: {
        rssMb: Math.round(process.memoryUsage().rss / (1024 * 1024)),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024))
      },
      nodeVersion: process.version,
      architecture: os.arch(),
      osPlatform: os.platform(),
      activeTasksCount: this.activeTasks.size
    };
  }

  /**
   * Dispatch a Cloud Background Task
   */
  async dispatchTask({
    name = 'Autonomous Task',
    type = 'SHELL_COMMAND', // 'SHELL_COMMAND', 'INVARIANT_TESTS', 'PROJECT_BUILD', 'RESEARCH_DIGEST'
    command = 'node --version',
    args = [],
    env = {}
  }) {
    const taskId = 'cltask_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const taskRecord = {
      id: taskId,
      name,
      type,
      command,
      args,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      exitCode: null,
      outputLogs: [],
      error: null
    };

    const taskFilePath = path.join(this.storageDir, `${taskId}.json`);
    fs.writeFileSync(taskFilePath, JSON.stringify(taskRecord, null, 2));

    // Spawn detached execution
    this.executeDetachedTask(taskId, taskRecord, env);

    return {
      success: true,
      taskId,
      message: `Cloud task "${name}" queued and started successfully.`,
      task: taskRecord
    };
  }

  /**
   * Execute task asynchronously with streaming logs
   */
  executeDetachedTask(taskId, taskRecord, customEnv = {}) {
    taskRecord.status = 'RUNNING';
    taskRecord.startedAt = new Date().toISOString();
    this.activeTasks.set(taskId, taskRecord);

    let cmd = taskRecord.command;
    let cmdArgs = taskRecord.args || [];

    if (taskRecord.type === 'INVARIANT_TESTS') {
      cmd = 'node';
      cmdArgs = [path.join(__dirname, '../../tests/comprehensive_test_suite.cjs')];
    } else if (taskRecord.type === 'PROJECT_BUILD') {
      cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      cmdArgs = ['vite', 'build'];
    }

    try {
      const isWindows = process.platform === 'win32';
      let child;

      if (taskRecord.type === 'SHELL_COMMAND') {
        child = spawn(cmd, cmdArgs, {
          shell: true,
          cwd: path.join(__dirname, '../..'),
          env: { ...process.env, ...customEnv }
        });
      } else {
        child = spawn(cmd, cmdArgs, {
          cwd: path.join(__dirname, '../..'),
          env: { ...process.env, ...customEnv }
        });
      }

      const appendLog = (chunk, isErr = false) => {
        const text = chunk.toString();
        const logEntry = {
          time: new Date().toISOString(),
          type: isErr ? 'STDERR' : 'STDOUT',
          text
        };
        taskRecord.outputLogs.push(logEntry);
        if (taskRecord.outputLogs.length > 500) {
          taskRecord.outputLogs.shift();
        }
      };

      child.stdout.on('data', (data) => appendLog(data, false));
      child.stderr.on('data', (data) => appendLog(data, true));

      child.on('error', (err) => {
        taskRecord.status = 'FAILED';
        taskRecord.completedAt = new Date().toISOString();
        taskRecord.error = err.message;
        this.saveTaskRecord(taskId, taskRecord);
        this.activeTasks.delete(taskId);
      });

      child.on('close', (code) => {
        taskRecord.status = code === 0 ? 'COMPLETED' : 'FAILED';
        taskRecord.exitCode = code;
        taskRecord.completedAt = new Date().toISOString();
        this.saveTaskRecord(taskId, taskRecord);
        this.activeTasks.delete(taskId);
      });
    } catch (err) {
      taskRecord.status = 'FAILED';
      taskRecord.completedAt = new Date().toISOString();
      taskRecord.error = err.message;
      this.saveTaskRecord(taskId, taskRecord);
      this.activeTasks.delete(taskId);
    }
  }

  saveTaskRecord(taskId, record) {
    try {
      const taskFilePath = path.join(this.storageDir, `${taskId}.json`);
      fs.writeFileSync(taskFilePath, JSON.stringify(record, null, 2));
    } catch (e) {
      console.warn('[CLOUD TASK SAVE ERROR]', e.message);
    }
  }

  getTask(taskId) {
    if (this.activeTasks.has(taskId)) {
      return this.activeTasks.get(taskId);
    }
    const taskFilePath = path.join(this.storageDir, `${taskId}.json`);
    if (fs.existsSync(taskFilePath)) {
      try {
        return JSON.parse(fs.readFileSync(taskFilePath, 'utf-8'));
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  listTasks(limit = 20) {
    try {
      this.ensureStorage();
      const files = fs.readdirSync(this.storageDir)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a))
        .slice(0, limit);

      const tasks = files.map(f => {
        try {
          return JSON.parse(fs.readFileSync(path.join(this.storageDir, f), 'utf-8'));
        } catch (_) {
          return null;
        }
      }).filter(Boolean);

      return {
        success: true,
        total: tasks.length,
        tasks
      };
    } catch (err) {
      return { success: false, error: err.message, tasks: [] };
    }
  }

  /**
   * 1-Click Deployment Templates & Config Generator
   */
  getDeployTemplates() {
    return {
      huggingface: {
        name: 'Hugging Face Spaces (100% Free 24/7 Cloud VM)',
        specs: '2 vCPU / 16 GB RAM / 50 GB Storage / Always-On / Free SSL URL',
        instructions: [
          '1. Go to https://huggingface.co/new-space',
          '2. Name your space (e.g., "brahma-cloud-computer")',
          '3. Select "Docker" as the Space SDK (Blank template)',
          '4. Select "Free 2 vCPU - 16 GB RAM"',
          '5. Push this repository to the Hugging Face Space Git remote or sync GitHub repository',
          '6. Brahma will run 24/7 in the cloud continuously with zero cost!'
        ],
        dockerfile: `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
RUN cd backend && npm install --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=7860
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/public ./public
COPY package*.json ./
EXPOSE 7860
CMD ["node", "backend/server.js"]`
      },
      githubActions: {
        name: 'GitHub Actions 24/7 Autonomous Cloud Runner',
        specs: '2-Core Ubuntu VM / 7 GB RAM / Free 2000 mins/month / Cron Scheduled',
        instructions: [
          '1. Workflow file is ready in .github/workflows/brahma-cloud-runner.yml',
          '2. It automatically runs on scheduled cron intervals and manual triggers',
          '3. Add any optional secrets (HF_API_TOKEN, GEMINI_API_KEY) in GitHub Repo Settings > Secrets',
          '4. Trigger runs manually anytime from GitHub Actions tab or via API'
        ],
        workflowPath: '.github/workflows/brahma-cloud-runner.yml'
      },
      termuxAndroid: {
        name: 'Android Phone 24/7 Zero-Watt Cloud Node (Termux)',
        specs: 'Runs on any old spare Android phone connected to Wi-Fi / charger',
        script: `#!/data/data/com.termux/files/usr/bin/bash
# BRAHMA 24/7 Android Autonomous Node Setup
pkg update -y && pkg install -y nodejs git openssh
git clone https://github.com/Samrudh2006/Brahma.git
cd Brahma
npm install --legacy-peer-deps
npm run build
node backend/server.js`
      }
    };
  }
}

module.exports = new CloudComputerService();
