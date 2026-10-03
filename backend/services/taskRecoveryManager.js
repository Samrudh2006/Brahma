/**
 * BRAHMA Task Recovery & Sleep-Resume Checkpoint Manager
 * Handles automatic task persistence across system Sleep Mode, Lid Closure, and Power Restarts.
 */
const fs = require('fs');
const path = require('path');

class TaskRecoveryManager {
  constructor() {
    this.checkpointPath = path.join(__dirname, '../db/task_checkpoint.json');
    this.tasks = new Map();
    this.lastHeartbeat = Date.now();
    this.heartbeatInterval = null;
    this.init();
  }

  init() {
    this.ensureDbDir();
    this.loadCheckpoints();
    this.startSleepCheckHeartbeat();
  }

  ensureDbDir() {
    const dbDir = path.dirname(this.checkpointPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  /**
   * Save task state checkpoint to disk
   */
  saveCheckpoint(taskData) {
    if (!taskData || !taskData.id) return;
    this.tasks.set(taskData.id, {
      ...taskData,
      updatedAt: Date.now(),
      status: taskData.status || 'in_progress'
    });

    try {
      const serializable = Array.from(this.tasks.entries());
      fs.writeFileSync(this.checkpointPath, JSON.stringify(serializable, null, 2), 'utf8');
    } catch (err) {
      console.warn('[TaskRecoveryManager] Failed to write checkpoint:', err.message);
    }
  }

  /**
   * Load stored checkpoints from disk on system startup or wake
   */
  loadCheckpoints() {
    try {
      if (fs.existsSync(this.checkpointPath)) {
        const raw = fs.readFileSync(this.checkpointPath, 'utf8');
        const entries = JSON.parse(raw);
        this.tasks = new Map(entries);
        console.log(`[TaskRecoveryManager] Restored ${this.tasks.size} task checkpoint(s) from persistent storage.`);
      }
    } catch (err) {
      console.warn('[TaskRecoveryManager] Error restoring task checkpoints:', err.message);
      this.tasks = new Map();
    }
  }

  /**
   * Continuous heartbeat detector to detect OS Sleep Mode (time jumps > 10s)
   */
  startSleepCheckHeartbeat() {
    this.lastHeartbeat = Date.now();
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastHeartbeat;

      // If elapsed > 6000ms (when interval is 3000ms), system was in Sleep/Suspended mode!
      if (elapsed > 7000) {
        const sleepDurationSec = Math.round(elapsed / 1000);
        console.log(`\n======================================================`);
        console.log(`⚡ [SLEEP DETECTED & RESUMED] System woke from Sleep Mode!`);
        console.log(`   Duration suspended: ~${sleepDurationSec} seconds`);
        console.log(`   Resuming background task queues & restoring state checkpoints...`);
        console.log(`======================================================\n`);
        
        this.onSystemWakeup(sleepDurationSec);
      }

      this.lastHeartbeat = now;
    }, 3000);
    if (this.heartbeatInterval && this.heartbeatInterval.unref) {
      this.heartbeatInterval.unref();
    }
  }

  /**
   * Called automatically when laptop wakes up from Sleep Mode
   */
  onSystemWakeup(sleepDurationSec) {
    this.loadCheckpoints();
    let resumedCount = 0;

    for (const [id, task] of this.tasks.entries()) {
      if (task.status === 'in_progress' || task.status === 'queued') {
        resumedCount++;
        task.status = 'in_progress';
        task.resumedAt = new Date().toISOString();
        task.sleepDurationSec = sleepDurationSec;
        this.saveCheckpoint(task);
      }
    }

    console.log(`[TaskRecoveryManager] Successfully auto-resumed ${resumedCount} pending background task(s).`);
  }

  /**
   * Get all active and resumed tasks
   */
  getTasks() {
    return Array.from(this.tasks.values());
  }

  /**
   * Clear completed task
   */
  completeTask(id) {
    if (this.tasks.has(id)) {
      const task = this.tasks.get(id);
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      this.saveCheckpoint(task);
    }
  }
}

module.exports = new TaskRecoveryManager();
