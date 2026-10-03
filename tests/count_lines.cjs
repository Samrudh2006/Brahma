const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const IGNORE_DIRS = ['node_modules', '.git', 'dist', '.vscode', 'uploads', '.gemini'];
const EXTENSIONS = ['.js', '.jsx', '.css', '.html', '.json', '.md', '.sql', '.yaml', '.yml'];

let totalLines = 0;
let totalFiles = 0;
const fileStats = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (IGNORE_DIRS.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(file);
      if (EXTENSIONS.includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n').length;
        totalLines += lines;
        totalFiles += 1;
        fileStats.push({ path: path.relative(ROOT_DIR, fullPath), lines });
      }
    }
  }
}

walk(ROOT_DIR);
fileStats.sort((a, b) => b.lines - a.lines);

console.log('=== BRAHMA CODEBASE AUDIT ===');
console.log(`Total Files: ${totalFiles}`);
console.log(`Total Lines of Code: ${totalLines.toLocaleString()}`);
console.log('\nTop 15 Largest Core Files:');
fileStats.slice(0, 15).forEach((f, i) => {
  console.log(`${i + 1}. [${f.lines.toLocaleString()} lines] ${f.path}`);
});
