#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './app.js';
import config from './utils/config.js';

const cli = meow(
  `
  Usage
    $ pideploy <command> [options]

  Commands
    login        Sign in to your account
    register     Create a new account
    deploy       Deploy a GitHub repo
    apps         List deployed apps
    whoami       Show current user
    logout       Sign out

  Examples
    $ pideploy login
    $ pideploy register
    $ pideploy deploy https://github.com/user/repo
    $ pideploy apps
`,
  {
    importMeta: import.meta,
  },
);

const command = cli.input[0] || '';
const args = cli.input.slice(1);

// Handle logout without rendering (no need for React)
if (command === 'logout') {
  config.set('token', '');
  config.set('email', '');
  console.log('\n  \x1b[32m✔\x1b[0m Logged out successfully.\n');
  process.exit(0);
}

render(<App command={command} args={args} />);
