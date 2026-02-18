import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import Spinner from 'ink-spinner';
import { apiPost } from '../utils/api.js';
import config from '../utils/config.js';
import { COLORS } from './Header.js';

const STEPS = [
  { label: 'Cloning repository', key: 'clone' },
  { label: 'Validating structure', key: 'validate' },
  { label: 'Building frontend', key: 'build' },
  { label: 'Starting backend container', key: 'backend' },
  { label: 'Configuring reverse proxy', key: 'nginx' },
];

export default function Deploy({ repo }) {
  const { exit } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!config.get('token')) {
      setError('Not logged in. Run: pideploy login');
      setTimeout(() => exit(), 1500);
      return;
    }

    if (!repo) {
      setError('No repo URL provided. Usage: pideploy deploy <repo-url>');
      setTimeout(() => exit(), 1500);
      return;
    }

    // Simulate step progression while API works
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 2500);

    apiPost('/deploy', { repo })
      .then((data) => {
        clearInterval(interval);
        setCurrentStep(STEPS.length);
        setResult(data);
        setTimeout(() => exit(), 3000);
      })
      .catch((err) => {
        clearInterval(interval);
        setError(err.message);
        setTimeout(() => exit(), 2000);
      });

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color={COLORS.red}>✖ Deploy Failed</Text>
        </Box>
        <Text color={COLORS.red}>  {error}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={COLORS.blue}>🚀 </Text>
        <Text bold>Deploying </Text>
        <Text color={COLORS.cyan}>{repo}</Text>
      </Box>

      {/* Step progress */}
      {STEPS.map((s, i) => {
        let icon, color;
        if (result && i < STEPS.length) {
          icon = '✔';
          color = COLORS.green;
        } else if (i < currentStep) {
          icon = '✔';
          color = COLORS.green;
        } else if (i === currentStep && !result) {
          return (
            <Box key={s.key}>
              <Text color={COLORS.yellow}>  <Spinner type="dots" /> </Text>
              <Text color={COLORS.yellow}> {s.label}...</Text>
            </Box>
          );
        } else {
          icon = '○';
          color = COLORS.dim;
        }

        return (
          <Box key={s.key}>
            <Text color={color}>  {icon} {s.label}</Text>
          </Box>
        );
      })}

      {/* Result */}
      {result && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={COLORS.dim}>  ┌──────────────────────────────────────┐</Text>
          <Text color={COLORS.dim}>  │                                      │</Text>
          <Box>
            <Text color={COLORS.dim}>  │  </Text>
            <Text bold color={COLORS.green}>App ID:   </Text>
            <Text color="#fff">{result.appId.padEnd(21)}</Text>
            <Text color={COLORS.dim}>   │</Text>
          </Box>
          <Box>
            <Text color={COLORS.dim}>  │  </Text>
            <Text bold color={COLORS.cyan}>Frontend: </Text>
            <Text color="#fff">{(result.frontendUrl || '').padEnd(21)}</Text>
            <Text color={COLORS.dim}>   │</Text>
          </Box>
          <Box>
            <Text color={COLORS.dim}>  │  </Text>
            <Text bold color={COLORS.yellow}>Backend:  </Text>
            <Text color="#fff">{(result.backendUrl || '').padEnd(21)}</Text>
            <Text color={COLORS.dim}>   │</Text>
          </Box>
          <Text color={COLORS.dim}>  │                                      │</Text>
          <Text color={COLORS.dim}>  └──────────────────────────────────────┘</Text>
        </Box>
      )}
    </Box>
  );
}
