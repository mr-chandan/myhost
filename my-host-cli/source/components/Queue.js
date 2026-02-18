import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import Spinner from 'ink-spinner';
import { apiGet } from '../utils/api.js';
import config from '../utils/config.js';
import { COLORS } from './Header.js';

export default function QueueStatus() {
  const { exit } = useApp();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config.get('token')) {
      setError('Not logged in. Run: pideploy login');
      setTimeout(() => exit(), 1500);
      return;
    }

    apiGet('/deploy/queue')
      .then((data) => {
        setStats(data);
        setTimeout(() => exit(), 1000);
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => exit(), 2000);
      });
  }, []);

  if (error) {
    return <Text color={COLORS.red}>  ✖ {error}</Text>;
  }

  if (!stats) {
    return (
      <Box>
        <Text color={COLORS.yellow}>  <Spinner type="dots" /> </Text>
        <Text color={COLORS.dim}> Fetching queue stats...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={COLORS.blue}>📊 </Text>
        <Text bold>Deploy Queue</Text>
      </Box>

      <Text color={COLORS.dim}>  ┌──────────────────────────────────────┐</Text>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.yellow}>Active:    </Text>
        <Text color="#fff">{String(stats.active).padEnd(20)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.cyan}>Waiting:   </Text>
        <Text color="#fff">{String(stats.waiting).padEnd(20)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.green}>Completed: </Text>
        <Text color="#fff">{String(stats.completed).padEnd(20)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.red}>Failed:    </Text>
        <Text color="#fff">{String(stats.failed).padEnd(20)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Text color={COLORS.dim}>  └──────────────────────────────────────┘</Text>
    </Box>
  );
}
