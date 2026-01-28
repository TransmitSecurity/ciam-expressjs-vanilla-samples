#!/usr/bin/env node

const { execSync } = require('child_process');

/**
 * Extract Jira ticket IDs from git commit messages between two commits
 * Usage: node extract-jira-tickets.js <from-commit> <to-commit>
 */

function extractJiraTickets(fromCommit, toCommit) {
  try {
    // Get git log between two commits (inclusive)
    // Format: %s = subject (commit message)
    const gitLogCommand = `git log --pretty=format:%s ${fromCommit}^..${toCommit}`;
    const output = execSync(gitLogCommand, { encoding: 'utf-8' });

    // Split by newlines to get individual commit messages
    const commitMessages = output.trim().split('\n');

    // Extract first word from each commit message
    const jiraTickets = new Set();

    commitMessages.forEach(message => {
      if (!message) return;

      // Get the first word (non-space) from the commit message
      const firstWord = message.trim().split(/\s+/)[0];

      // Check if it looks like a Jira ticket ID (format: PROJECT-123)
      // Jira ticket pattern: uppercase letters, dash, numbers
      const jiraPattern = /^[A-Z][A-Z0-9]*-\d+$/;

      if (jiraPattern.test(firstWord)) {
        jiraTickets.add(firstWord);
      }
    });

    return Array.from(jiraTickets).sort();
  } catch (error) {
    console.error('Error executing git command:', error.message);
    process.exit(1);
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error('Usage: node extract-jira-tickets.js <from-commit> <to-commit>');
    console.error('Example: node extract-jira-tickets.js abc123 def456');
    process.exit(1);
  }

  const [fromCommit, toCommit] = args;

  console.log(`Extracting Jira tickets from ${fromCommit} to ${toCommit}...\n`);

  const tickets = extractJiraTickets(fromCommit, toCommit);

  if (tickets.length === 0) {
    console.log('No Jira ticket IDs found in commit messages.');
  } else {
    console.log('Found Jira tickets:');
    tickets.forEach(ticket => {
      console.log(`  ${ticket}`);
    });
    console.log(`\nTotal: ${tickets.length} unique ticket(s)`);
  }
}

main();
