import React from 'react';
import { Box, Text, useApp } from 'ink';
import config from '../utils/config.js';
import { COLORS } from './Header.js';

export default function Whoami() {
  const { exit } = useApp();
  const email = config.get('email');
  const token = config.get('token');

  if (!token) {
    setTimeout(() => exit(), 500);
    return (
      <Box flexDirection="column">
        <Text color={COLORS.red}>  ✖ Not logged in.</Text>
        <Text color={COLORS.dim}>  Run: pideploy login</Text>
      </Box>
    );
  }

  // Decode JWT payload (base64)
  let payload = {};
  try {
    const parts = token.split('.');
    payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  } catch (e) {
    // ignore
  }

  setTimeout(() => exit(), 500);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={COLORS.blue}>👤 </Text>
        <Text bold>Current User</Text>
      </Box>

      <Text color={COLORS.dim}>  ┌──────────────────────────────────────┐</Text>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.cyan}>Email:  </Text>
        <Text color="#fff">{(email || 'unknown').padEnd(23)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.green}>ID:     </Text>
        <Text color="#fff">{(payload.id || 'unknown').padEnd(23)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Box>
        <Text color={COLORS.dim}>  │  </Text>
        <Text bold color={COLORS.yellow}>API:    </Text>
        <Text color="#fff">{config.get('apiUrl').padEnd(23)}</Text>
        <Text color={COLORS.dim}>  │</Text>
      </Box>
      <Text color={COLORS.dim}>  └──────────────────────────────────────┘</Text>
    </Box>
  );
}
