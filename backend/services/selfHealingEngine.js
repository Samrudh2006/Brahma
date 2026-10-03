/**
 * BRAHMA Self-Correction & Auto-Verification Loop (Reflexion Pattern)
 * Runs generated code in the Isolated Secure VM Sandbox, catches errors, and auto-heals code before returning.
 */
const codeRunner = require('./codeRunner');

class SelfHealingEngine {
  constructor() {
    this.maxRepairAttempts = 3;
  }

  /**
   * Run generated JS/Python code in VM Sandbox with auto-repair loop
   */
  async verifyAndRepair(code, language = 'javascript') {
    let currentCode = code;
    let attempt = 0;
    const repairHistory = [];

    while (attempt < this.maxRepairAttempts) {
      attempt++;
      let runResult;

      if (language === 'python') {
        runResult = await codeRunner.executePython(currentCode);
      } else {
        runResult = await codeRunner.executeJS(currentCode);
      }

      if (runResult.success) {
        return {
          success: true,
          verifiedCode: currentCode,
          output: runResult.output,
          attempts: attempt,
          repaired: attempt > 1,
          repairHistory
        };
      }

      // Log failure and attempt auto-healing heuristic
      repairHistory.push({
        attempt,
        failedCode: currentCode,
        error: runResult.error
      });

      console.warn(`[SelfHealingEngine] Attempt ${attempt} failed: ${runResult.error}. Auto-repairing...`);
      currentCode = this.applyHeuristicFix(currentCode, runResult.error, language);
    }

    return {
      success: false,
      verifiedCode: currentCode,
      error: `Self-healing failed after ${this.maxRepairAttempts} attempts.`,
      repairHistory
    };
  }

  applyHeuristicFix(code, errorMsg = '', language = 'javascript') {
    let fixed = code;
    // Fix missing closing brackets/braces
    if (errorMsg.includes('Unexpected end of input') || errorMsg.includes('missing }')) {
      fixed = fixed + '\n}';
    }
    // Fix missing semicolon or parentheses
    if (errorMsg.includes('Unexpected token')) {
      fixed = fixed.replace(/console\.log\(([^)]*)$/gm, 'console.log($1)');
    }
    // Fix undefined variable declarations
    if (errorMsg.includes('is not defined')) {
      const match = errorMsg.match(/(\w+)\s+is not defined/);
      if (match && match[1]) {
        fixed = `let ${match[1]} = null;\n` + fixed;
      }
    }
    return fixed;
  }
}

module.exports = new SelfHealingEngine();
