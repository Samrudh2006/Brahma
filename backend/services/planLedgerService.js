/**
 * BRAHMA Sovereign Plan Ledger Service
 * 
 * Enforces Two-Phase Planning & Oracle Verification Architecture:
 * 1. Plan Phase: Generates structured markdown specifications in `plans/<slug>.md`
 * 2. Execution Phase: Tracks atomic checklist progress item-by-item
 * 3. Completion Phase: Verifies all invariants before sealing the plan
 */

const fs = require('fs');
const path = require('path');

const PLANS_DIR = path.join(__dirname, '../../plans');

class PlanLedgerService {
  constructor() {
    this.ensurePlansDirectory();
  }

  ensurePlansDirectory() {
    if (!fs.existsSync(PLANS_DIR)) {
      fs.mkdirSync(PLANS_DIR, { recursive: true });
    }
  }

  /**
   * Create or update a structured plan markdown artifact
   */
  createPlan(slug, { title, objective, invariants = [], checklist = [] }) {
    this.ensurePlansDirectory();
    const cleanSlug = (slug || `plan_${Date.now().toString(36)}`).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const filePath = path.join(PLANS_DIR, `${cleanSlug}.md`);

    const markdown = [
      `# 🔱 Plan: ${title || cleanSlug}`,
      `> Created: ${new Date().toISOString()} • Status: IN_PROGRESS`,
      '',
      '## 1. Objective',
      objective || 'Autonomous multi-step execution objective.',
      '',
      '## 2. Invariants & Guardrails',
      ...(invariants.length > 0 ? invariants.map(inv => `- 🛡️ ${inv}`) : ['- Zero regressions on existing test invariants']),
      '',
      '## 3. Execution Checklist',
      ...(checklist.length > 0
        ? checklist.map(item => `- [ ] ${item}`)
        : ['- [ ] Step 1: Initial inspection and dependency setup', '- [ ] Step 2: Implementation', '- [ ] Step 3: Oracle test suite verification']),
      '',
      '## 4. Oracle Verification Criteria',
      '- Automated verification command: `npm run test:full`',
      '- Exit code requirement: `0` (100% test pass rate)'
    ].join('\n');

    fs.writeFileSync(filePath, markdown, 'utf-8');

    return {
      success: true,
      slug: cleanSlug,
      filePath,
      status: 'PLAN_CREATED'
    };
  }

  /**
   * Retrieve and parse a plan markdown file
   */
  getPlan(slug) {
    this.ensurePlansDirectory();
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const filePath = path.join(PLANS_DIR, `${cleanSlug}.md`);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: `Plan "${cleanSlug}" does not exist` };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const checklistMatches = [...content.matchAll(/- \[([ xX])\] (.*)/g)];
    const checklist = checklistMatches.map((m, idx) => ({
      index: idx,
      completed: m[1].toLowerCase() === 'x',
      text: m[2].trim()
    }));

    const total = checklist.length;
    const completed = checklist.filter(c => c.completed).length;

    return {
      success: true,
      slug: cleanSlug,
      filePath,
      rawContent: content,
      stats: {
        totalSteps: total,
        completedSteps: completed,
        percentComplete: total > 0 ? Math.round((completed / total) * 100) : 100,
        isFullyComplete: total > 0 && completed === total
      },
      checklist
    };
  }

  /**
   * List all stored plans
   */
  listPlans() {
    this.ensurePlansDirectory();
    const files = fs.readdirSync(PLANS_DIR).filter(f => f.endsWith('.md'));

    return files.map(file => {
      const slug = file.replace(/\.md$/, '');
      const plan = this.getPlan(slug);
      return {
        slug,
        fileName: file,
        stats: plan.stats
      };
    });
  }

  /**
   * Toggle or mark a checklist item as completed
   */
  updateChecklistItem(slug, itemIndex, isCompleted = true) {
    this.ensurePlansDirectory();
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const filePath = path.join(PLANS_DIR, `${cleanSlug}.md`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Plan "${cleanSlug}" not found`);
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    let currentIndex = 0;

    content = content.replace(/- \[([ xX])\] (.*)/g, (match, checkState, text) => {
      if (currentIndex === itemIndex) {
        currentIndex++;
        return `- [${isCompleted ? 'x' : ' '}] ${text}`;
      }
      currentIndex++;
      return match;
    });

    fs.writeFileSync(filePath, content, 'utf-8');
    return this.getPlan(cleanSlug);
  }

  /**
   * Oracle verification gate: check if all checklist items are completed
   */
  verifyPlanCompletion(slug) {
    const plan = this.getPlan(slug);
    if (!plan.success) return plan;

    return {
      slug,
      canSeal: plan.stats.isFullyComplete,
      remainingSteps: plan.checklist.filter(c => !c.completed).map(c => c.text),
      message: plan.stats.isFullyComplete
        ? 'All plan checklist items verified and ready for Oracle sealing.'
        : `Plan has ${plan.stats.totalSteps - plan.stats.completedSteps} uncompleted steps.`
    };
  }

  /**
   * AI-DLC Task DAG Compiler
   * Validates task dependencies, detects circular references, and computes parallel execution batches.
   */
  createTaskDAG(slugOrOptions, maybeOptions = {}) {
    let slug = 'dag_' + Date.now().toString(36);
    let title = 'Sovereign Workflow DAG';
    let nodes = [];

    if (Array.isArray(slugOrOptions)) {
      nodes = slugOrOptions;
    } else if (typeof slugOrOptions === 'object' && slugOrOptions !== null) {
      slug = slugOrOptions.slug || slug;
      title = slugOrOptions.title || title;
      nodes = slugOrOptions.nodes || slugOrOptions.tasks || [];
    } else if (typeof slugOrOptions === 'string') {
      slug = slugOrOptions;
      title = maybeOptions.title || title;
      nodes = maybeOptions.nodes || maybeOptions.tasks || (Array.isArray(maybeOptions) ? maybeOptions : []);
    }

    const nodeMap = new Map();
    const inDegree = new Map();
    const adj = new Map();

    for (const n of nodes) {
      if (!n.id) throw new Error('DAG node requires an id');
      const deps = n.dependsOn || n.dependencies || [];
      nodeMap.set(n.id, { ...n, dependsOn: deps, dependencies: deps, status: 'PENDING' });
      inDegree.set(n.id, deps.length);
      adj.set(n.id, []);
    }

    // Populate adjacency list
    for (const n of nodeMap.values()) {
      for (const dep of n.dependsOn) {
        if (!nodeMap.has(dep)) {
          return {
            success: false,
            error: `Undeclared dependency '${dep}' referenced by task '${n.id}'`
          };
        }
        adj.get(dep).push(n.id);
      }
    }

    // Kahn's Algorithm for Topological Sort & Level Batching
    const queue = [];
    for (const [id, deg] of inDegree.entries()) {
      if (deg === 0) queue.push({ id, level: 0 });
    }

    const sortedOrder = [];
    const executionBatches = [];

    while (queue.length > 0) {
      const { id, level } = queue.shift();
      sortedOrder.push(id);

      if (!executionBatches[level]) executionBatches[level] = [];
      executionBatches[level].push(id);

      for (const neighbor of adj.get(id)) {
        const newDeg = inDegree.get(neighbor) - 1;
        inDegree.set(neighbor, newDeg);
        if (newDeg === 0) {
          queue.push({ id: neighbor, level: level + 1 });
        }
      }
    }

    // Cycle detection
    if (sortedOrder.length !== nodes.length) {
      return {
        success: false,
        error: 'CIRCULAR_DEPENDENCY_CYCLE_DETECTED: Graph contains an unresolvable loop. Circular dependency detected.',
        unresolvedCount: nodes.length - sortedOrder.length
      };
    }

    const stages = executionBatches.map(batch => batch.map(id => nodeMap.get(id)));

    const dagManifest = {
      slug: (slug || 'dag_' + Date.now().toString(36)).toLowerCase(),
      title,
      totalTasks: nodes.length,
      topologicalOrder: sortedOrder,
      executionBatches,
      stages,
      totalLevels: executionBatches.length,
      isAcyclic: true,
      stage: 'TASK_DAG_COMPILED',
      nodes: Array.from(nodeMap.values())
    };

    return {
      success: true,
      dag: dagManifest
    };
  }

  /**
   * Execute DAG in Parallel Batches
   */
  async executeDAG(dagManifest, { executorFn = null } = {}) {
    const manifest = (dagManifest && dagManifest.dag) ? dagManifest.dag : (dagManifest || {});
    const results = {};
    let hasFailure = false;
    const batches = manifest.executionBatches || manifest.stages || [];
    const allNodes = manifest.nodes || [];

    for (let level = 0; level < batches.length; level++) {
      const batch = batches[level];
      const batchIds = batch.map(item => (typeof item === 'object' && item !== null && item.id ? item.id : item));
      
      // Parallel execution of tasks at this level
      const batchPromises = batchIds.map(async (taskId) => {
        const node = allNodes.find(n => n.id === taskId) || { id: taskId };
        const deps = node.dependsOn || node.dependencies || [];
        
        // If prior dependency failed, auto-block downstream task
        const unmetDeps = deps.some(depId => results[depId] && !results[depId].success);
        if (unmetDeps || hasFailure) {
          results[taskId] = { success: false, status: 'BLOCKED_DEPENDENCY_FAILURE', taskId };
          return;
        }

        try {
          if (typeof executorFn === 'function') {
            const out = await executorFn(node);
            results[taskId] = { success: true, status: 'COMPLETED', output: out, taskId };
          } else {
            results[taskId] = { success: true, status: 'COMPLETED', taskId };
          }
        } catch (err) {
          hasFailure = true;
          results[taskId] = { success: false, status: 'FAILED', error: err.message, taskId };
        }
      });

      await Promise.all(batchPromises);
    }

    const completedCount = Object.values(results).filter(r => r.success).length;
    const failedCount = Object.values(results).filter(r => !r.success).length;

    return {
      success: !hasFailure,
      slug: manifest.slug,
      allCompleted: Object.values(results).every(r => r.success),
      summary: {
        totalStages: batches.length,
        completedTasks: completedCount,
        failedTasks: failedCount
      },
      taskResults: results
    };
  }
}

module.exports = new PlanLedgerService();
