#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked options for better HTML output
marked.setOptions({
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: true, // Add id attributes to headers
  mangle: false, // Don't mangle email addresses
  sanitize: false, // Don't sanitize HTML (be careful with user input)
  smartypants: true, // Use smart quotes, etc.
});

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
  try {
    const html = marked(markdown);
    return html;
  } catch (error) {
    console.error('Error converting markdown to HTML:', error.message);
    process.exit(1);
  }
}

// Function to read markdown from file
function readMarkdownFromFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    process.exit(1);
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Read from stdin
    let markdown = '';
    process.stdin.on('data', chunk => {
      markdown += chunk;
    });
    process.stdin.on('end', () => {
      const html = markdownToHtml(markdown);
      console.log(html);
    });
    process.stdin.setEncoding('utf8');
  } else if (args.length === 1) {
    // Read from file
    const filePath = args[0];
    const markdown = readMarkdownFromFile(filePath);
    const html = markdownToHtml(markdown);
    console.log(html);
  } else if (args.length === 2 && args[0] === '-o') {
    // Output to file
    const outputPath = args[1];
    let markdown = '';

    if (process.stdin.isTTY) {
      console.error('Usage: echo "markdown" | node markdown-to-html.js -o output.html');
      process.exit(1);
    }

    process.stdin.on('data', chunk => {
      markdown += chunk;
    });
    process.stdin.on('end', () => {
      const html = markdownToHtml(markdown);
      try {
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log(`HTML written to ${outputPath}`);
      } catch (error) {
        console.error(`Error writing to file ${outputPath}:`, error.message);
        process.exit(1);
      }
    });
    process.stdin.setEncoding('utf8');
  } else {
    console.error('Usage:');
    console.error('  node markdown-to-html.js <input.md>           # Convert file to HTML');
    console.error('  echo "markdown" | node markdown-to-html.js    # Convert stdin to HTML');
    console.error('  echo "markdown" | node markdown-to-html.js -o output.html  # Convert stdin to file');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { markdownToHtml };
