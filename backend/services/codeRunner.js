/**
 * BRAHMA Polyglot Code Sandbox Runner using Node.js Native vm Module
 */
const vm = require('vm');
const { exec } = require('child_process');

class CodeRunner {
  /**
   * Execute JavaScript in sandboxed context
   */
  async executeJS(code, timeoutMs = 3000) {
    const logs = [];
    const context = {
      console: {
        log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args) => logs.push('[ERROR] ' + args.join(' ')),
        warn: (...args) => logs.push('[WARN] ' + args.join(' ')),
      },
      Math,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean,
      RegExp,
      JSON,
    };

    vm.createContext(context);
    const startTime = Date.now();
    try {
      const script = new vm.Script(code);
      const result = script.runInContext(context, { timeout: timeoutMs });
      const executionTimeMs = Date.now() - startTime;
      return {
        success: true,
        output: logs.join('\n') || (result !== undefined ? String(result) : '[Execution finished with 0 errors]'),
        result,
        executionTimeMs,
      };
    } catch (err) {
      return {
        success: false,
        output: logs.join('\n'),
        error: err.message,
        executionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute Python code if python runtime is installed
   */
  async executePython(code) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      exec(`python -c "${code.replace(/"/g, '\\"')}"`, { timeout: 4000 }, (error, stdout, stderr) => {
        const executionTimeMs = Date.now() - startTime;
        if (error) {
          resolve({
            success: false,
            output: stdout || stderr,
            error: error.message,
            executionTimeMs,
          });
        } else {
          resolve({
            success: true,
            output: stdout || '[Python script executed successfully]',
            executionTimeMs,
          });
        }
      });
    });
  }
}

module.exports = new CodeRunner();
