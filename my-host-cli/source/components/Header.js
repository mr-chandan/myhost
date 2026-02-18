import React from 'react';
import { Box, Text } from 'ink';

const COLORS = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
  cyan: '#00BCD4',
  dim: '#9E9E9E',
};

export default function Header() {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold color={COLORS.blue}>M</Text>
        <Text bold color={COLORS.red}>y</Text>
        <Text bold color={COLORS.yellow}>H</Text>
        <Text bold color={COLORS.blue}>o</Text>
        <Text bold color={COLORS.green}>s</Text>
        <Text bold color={COLORS.red}>t</Text>
        <Text color={COLORS.dim}> CLI</Text>
        <Text color={COLORS.dim}> v1.0.0</Text>
      </Box>
      <Text color={COLORS.dim}>─────────────────────────────────────</Text>
    </Box>
  );
}

export { COLORS };
