/**
 * BRAHMA AST Workspace Dependency Graph Engine
 * Scans project files, builds import/export mappings and function call graphs.
 */
const fs = require('fs');
const path = require('path');

class ASTGraphEngine {
  constructor() {
    this.rootPath = path.join(__dirname, '../../src');
  }

  /**
   * Scan src directory and build module dependency graph
   */
  buildGraph(dir = this.rootPath) {
    const graph = {
      nodes: [],
      links: [],
      stats: { totalFiles: 0, totalImports: 0 }
    };

    try {
      if (!fs.existsSync(dir)) return graph;

      const scanDir = (currentDir) => {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
          const fullPath = path.join(currentDir, file);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !file.startsWith('.')) {
            scanDir(fullPath);
          } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            graph.stats.totalFiles++;
            const relativePath = path.relative(this.rootPath, fullPath).replace(/\\/g, '/');
            const content = fs.readFileSync(fullPath, 'utf8');

            const imports = [];
            const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
            let match;

            while ((match = importRegex.exec(content)) !== null) {
              imports.push(match[1]);
              graph.stats.totalImports++;
            }

            graph.nodes.push({
              id: relativePath,
              name: file,
              importsCount: imports.length,
              imports
            });

            imports.forEach(imp => {
              graph.links.push({ source: relativePath, target: imp });
            });
          }
        }
      };

      scanDir(dir);
    } catch (err) {
      console.warn('[ASTGraphEngine] Scan warning:', err.message);
    }

    return graph;
  }
}

module.exports = new ASTGraphEngine();
