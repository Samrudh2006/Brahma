/**
 * BRAHMA — Webcmd Agent Intelligence & Browser Infrastructure Service
 * Powered by @agentrhq/webcmd
 * Turns websites, browser sessions, desktop apps, and local tools into deterministic CLI surfaces.
 */
const { exec } = require('child_process');

class WebcmdService {
  constructor() {
    this.token = process.env.WEBCMD_TOKEN || 'eyJwaWQiOjMxMjI4ODAsInNpZCI6MTI1ODg4MTI0MywiYXgiOiI2YzA0ZjU0OWQxMWMzZDE5ZGRjMmFmMTJkODY1MzRlMyIsInRzIjoxNzkwODU1NDUwLCJleHAiOjE3OTMyNzQ2NTB9.NLB46sCcRLRuTNvBlfJrfIbjzfsoSTDJZTdKkD1mqO8';
    this.isAvailable = true;
  }

  /**
   * Run a webcmd CLI command with token environment
   */
  async runCommand(args = [], timeoutMs = 25000) {
    return new Promise((resolve) => {
      const fullCmd = `npx -y @agentrhq/webcmd ${args.join(' ')}`;
      const env = {
        ...process.env,
        WEBCMD_TOKEN: this.token
      };

      exec(fullCmd, { env, timeout: timeoutMs, windowsHide: true }, (err, stdout, stderr) => {
        if (err && err.code !== 0) {
          resolve({
            success: false,
            code: err.code,
            stdout: (stdout || '').trim(),
            stderr: (stderr || '').trim(),
            error: err.message
          });
        } else {
          resolve({
            success: true,
            stdout: (stdout || '').trim(),
            stderr: (stderr || '').trim()
          });
        }
      });
    });
  }

  /**
   * Get Webcmd status & diagnostic info
   */
  async getStatus() {
    try {
      const res = await this.runCommand(['--version'], 10000);
      return {
        online: res.success,
        version: res.stdout || '0.8.4',
        provider: '@agentrhq/webcmd',
        tokenActive: Boolean(this.token),
        features: [
          'Browser Session Management',
          'Self-Learning Navigation Memory',
          'Deterministic Website CLI Mapping',
          'Playwright Core Automation',
          'Cookie Jar Context Isolation'
        ]
      };
    } catch (err) {
      return {
        online: false,
        error: err.message,
        provider: '@agentrhq/webcmd'
      };
    }
  }

  /**
   * List available website CLI surfaces
   */
  async listSites() {
    const res = await this.runCommand(['list', '-f', 'json'], 15000);
    if (res.success) {
      try {
        return JSON.parse(res.stdout);
      } catch (_) {
        return { raw: res.stdout };
      }
    }
    return { error: res.error, stdout: res.stdout };
  }

  /**
   * Execute an automated web browser action / command
   */
  async execute(site, command, commandArgs = []) {
    const args = [site, command, ...commandArgs];
    return await this.runCommand(args, 30000);
  }
}

module.exports = new WebcmdService();
