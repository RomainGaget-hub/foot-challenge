const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}🔍 Checking for .env file...${colors.reset}`);
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.log(
    `${colors.red}❌ .env file not found. Please create one first.${colors.reset}`
  );
  process.exit(1);
}

console.log(`${colors.green}✅ .env file found${colors.reset}`);

// Function to execute commands with pretty printing
function executeCommand(command, description) {
  console.log(`${colors.blue}🚀 ${description}...${colors.reset}`);

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(
      `${colors.green}✅ Success: ${description}${colors.reset}`
    );
  } catch (error) {
    console.error(`${colors.red}❌ Failed: ${description}${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

// Main execution
console.log(
  `${colors.yellow}==== Football Challenge Database Initialization ====${colors.reset}`
);

// Generate Prisma client
executeCommand('npx prisma generate', 'Generating Prisma client');

// Create migrations
executeCommand(
  'npx prisma migrate dev --name init',
  'Creating database migrations'
);

// Seed the database
executeCommand(
  'npm run db:seed',
  'Seeding the database with initial data'
);

console.log(
  `${colors.green}==== Database initialization completed successfully! ====${colors.reset}`
);
console.log(
  `${colors.yellow}You can now start your application:${colors.reset}`
);
console.log(`${colors.blue}npm run dev${colors.reset}`);
