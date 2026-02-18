import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import Spinner from 'ink-spinner';
import { apiGet } from '../utils/api.js';
import config from '../utils/config.js';
import { COLORS } from './Header.js';

export default function Apps() {
  const { exit } = useApp();
  const [apps, setApps] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config.get('token')) {
      setError('Not logged in. Run: myhost login');
      setTimeout(() => exit(), 1500);
      return;
    }

    apiGet('/apps')
      .then((data) => {
        setApps(data.apps || []);
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => exit(), 2000);
      });
  }, []);

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color={COLORS.red}>  ✖ {error}</Text>
      </Box>
    );
  }

  if (!apps) {
    return (
      <Box>
        <Text color={COLORS.yellow}>  <Spinner type="dots" /> </Text>
        <Text color={COLORS.dim}> Fetching apps...</Text>
      </Box>
    );
  }

  if (apps.length === 0) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color={COLORS.blue}>📦 </Text>
          <Text bold>Your Deployed Apps</Text>
        </Box>
        <Text color={COLORS.dim}>  No apps deployed yet. Run: myhost deploy &lt;repo-url&gt;</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={COLORS.blue}>📦 </Text>
        <Text bold>Your Deployed Apps</Text>
        <Text color={COLORS.dim}> ({apps.length})</Text>
      </Box>

      {/* Table header */}
      <Box>
        <Text bold color={COLORS.cyan}>  {'#'.padEnd(4)}</Text>
        <Text bold color={COLORS.cyan}>{'APP ID'.padEnd(18)}</Text>
        <Text bold color={COLORS.cyan}>{'STATUS'}</Text>
      </Box>
      <Text color={COLORS.dim}>  {'─'.repeat(36)}</Text>

      {/* Rows */}
      {apps.map((app, i) => (
        <Box key={app.appId}>
          <Text color={COLORS.dim}>  {String(i + 1).padEnd(4)}</Text>
          <Text color="#fff">{app.appId.padEnd(18)}</Text>
          <Text color={COLORS.green}>● running</Text>
        </Box>
      ))}

      <Text color={COLORS.dim}>{'\n'}  Run `myhost deploy &lt;repo&gt;` to add more apps.</Text>
    </Box>
  );
}
