const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function executeCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    throw error;
  }
}

function updateReadme() {
  const readmePath = path.join(__dirname, 'README.md');
  const timestamp = new Date().toISOString();
  const content = `# Auto-Updated Repository

Last updated: ${timestamp}

This repository is automatically updated daily.

## Update Log
- Updated on ${timestamp}
`;

  fs.writeFileSync(readmePath, content);
  console.log('README.md updated successfully');
}

function commitAndPush() {
  const timestamp = new Date().toISOString();
  
  // Configure git if needed
  if (process.env.GIT_USER_NAME && process.env.GIT_USER_EMAIL) {
    executeCommand(`git config user.name "${process.env.GIT_USER_NAME}"`);
    executeCommand(`git config user.email "${process.env.GIT_USER_EMAIL}"`);
  }

  // Stage changes
  executeCommand('git add README.md');
  
  // Commit
  executeCommand(`git commit -m "Auto-update: ${timestamp}"`);
  
  // Push
  executeCommand('git push origin main');
  
  console.log('Changes committed and pushed successfully');
}

function main() {
  console.log('Starting auto-commit process...');
  
  try {
    updateReadme();
    commitAndPush();
    console.log('Auto-commit completed successfully!');
  } catch (error) {
    console.error('Auto-commit failed:', error);
    process.exit(1);
  }
}

main();
