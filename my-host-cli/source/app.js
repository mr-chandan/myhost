import React from 'react';
import { Box, Text } from 'ink';
import Header from './components/Header.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Deploy from './components/Deploy.js';
import Apps from './components/Apps.js';
import Whoami from './components/Whoami.js';
import { COLORS } from './components/Header.js';

function HelpScreen() {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>Available Commands:</Text>
      </Box>

      <Box>
        <Text bold color={COLORS.green}>  {'login'.padEnd(14)}</Text>
        <Text color={COLORS.dim}>Sign in to your account</Text>
      </Box>
      <Box>
        <Text bold color={COLORS.green}>  {'register'.padEnd(14)}</Text>
        <Text color={COLORS.dim}>Create a new account</Text>
      </Box>
      <Box>
        <Text bold color={COLORS.cyan}>  {'deploy <url>'.padEnd(14)}</Text>
        <Text color={COLORS.dim}>Deploy a GitHub repo</Text>
      </Box>
      <Box>
        <Text bold color={COLORS.cyan}>  {'apps'.padEnd(14)}</Text>
        <Text color={COLORS.dim}>List deployed apps</Text>
      </Box>
      <Box>
        <Text bold color={COLORS.yellow}>  {'whoami'.padEnd(14)}</Text>
        <Text color={COLORS.dim}>Show current user</Text>
      </Box>
      <Box>
        <Text bold color={COLORS.red}>  {'logout'.padEnd(14)}</Text>
        <Text color={COLORS.dim}>Sign out</Text>
      </Box>

      <Box marginTop={1}>
        <Text color={COLORS.dim}>  Example: myhost deploy https://github.com/user/repo</Text>
      </Box>
    </Box>
  );
}

export default function App({ command, args }) {
  const renderCommand = () => {
    switch (command) {
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'deploy':
        return <Deploy repo={args[0]} />;
      case 'apps':
        return <Apps />;
      case 'whoami':
        return <Whoami />;
      default:
        return <HelpScreen />;
    }
  };

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      <Header />
      {renderCommand()}
    </Box>
  );
}
