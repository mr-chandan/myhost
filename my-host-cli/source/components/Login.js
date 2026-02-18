import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { apiPost } from '../utils/api.js';
import config from '../utils/config.js';
import { COLORS } from './Header.js';

export default function Login() {
  const { exit } = useApp();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setStep('password');
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) return;
    setStatus('loading');

    try {
      const data = await apiPost('/auth/login', { email, password });
      config.set('token', data.token);
      config.set('email', email);
      setStatus('success');
      setTimeout(() => exit(), 1500);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => exit(), 2000);
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={COLORS.blue}>⚡ </Text>
        <Text bold>Sign in to PiDeploy</Text>
      </Box>

      {/* Email input */}
      <Box>
        <Text color={COLORS.dim}>  Email: </Text>
        {step === 'email' ? (
          <TextInput value={email} onChange={setEmail} onSubmit={handleEmailSubmit} placeholder="you@example.com" />
        ) : (
          <Text color={COLORS.green}>{email}</Text>
        )}
      </Box>

      {/* Password input */}
      {(step === 'password' || status) && (
        <Box>
          <Text color={COLORS.dim}>  Password: </Text>
          {step === 'password' && !status ? (
            <TextInput value={password} onChange={setPassword} onSubmit={handlePasswordSubmit} mask="*" />
          ) : (
            <Text color={COLORS.dim}>{'*'.repeat(password.length)}</Text>
          )}
        </Box>
      )}

      {/* Status */}
      {status === 'loading' && (
        <Box marginTop={1}>
          <Text color={COLORS.yellow}>  <Spinner type="dots" /> </Text>
          <Text color={COLORS.dim}> Authenticating...</Text>
        </Box>
      )}

      {status === 'success' && (
        <Box marginTop={1} flexDirection="column">
          <Text color={COLORS.green}>  ✔ Logged in successfully!</Text>
          <Text color={COLORS.dim}>  Token saved. You're ready to deploy.</Text>
        </Box>
      )}

      {status === 'error' && (
        <Box marginTop={1}>
          <Text color={COLORS.red}>  ✖ {errorMsg}</Text>
        </Box>
      )}
    </Box>
  );
}
