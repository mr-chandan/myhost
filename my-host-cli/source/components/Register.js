import React, { useState } from 'react';
import { Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import Spinner from 'ink-spinner';
import { apiPost } from '../utils/api.js';
import config from '../utils/config.js';
import { COLORS } from './Header.js';

export default function Register() {
  const { exit } = useApp();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = () => {
    if (email.trim()) setStep('password');
  };

  const handlePasswordSubmit = () => {
    if (password.trim()) setStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMsg('Passwords do not match');
      setTimeout(() => exit(), 2000);
      return;
    }

    setStatus('loading');
    try {
      await apiPost('/auth/register', { email, password });

      // Auto-login after register
      const loginData = await apiPost('/auth/login', { email, password });
      config.set('token', loginData.token);
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
        <Text bold>Create a MyHost account</Text>
      </Box>

      {/* Email */}
      <Box>
        <Text color={COLORS.dim}>  Email: </Text>
        {step === 'email' ? (
          <TextInput value={email} onChange={setEmail} onSubmit={handleEmailSubmit} placeholder="you@example.com" />
        ) : (
          <Text color={COLORS.green}>{email}</Text>
        )}
      </Box>

      {/* Password */}
      {(step === 'password' || step === 'confirm' || status) && (
        <Box>
          <Text color={COLORS.dim}>  Password: </Text>
          {step === 'password' && !status ? (
            <TextInput value={password} onChange={setPassword} onSubmit={handlePasswordSubmit} mask="*" />
          ) : (
            <Text color={COLORS.dim}>{'*'.repeat(password.length)}</Text>
          )}
        </Box>
      )}

      {/* Confirm Password */}
      {(step === 'confirm' || status) && step !== 'password' && (
        <Box>
          <Text color={COLORS.dim}>  Confirm:  </Text>
          {step === 'confirm' && !status ? (
            <TextInput value={confirmPassword} onChange={setConfirmPassword} onSubmit={handleConfirmSubmit} mask="*" />
          ) : (
            <Text color={COLORS.dim}>{'*'.repeat(confirmPassword.length)}</Text>
          )}
        </Box>
      )}

      {/* Status */}
      {status === 'loading' && (
        <Box marginTop={1}>
          <Text color={COLORS.yellow}>  <Spinner type="dots" /> </Text>
          <Text color={COLORS.dim}> Creating account...</Text>
        </Box>
      )}

      {status === 'success' && (
        <Box marginTop={1} flexDirection="column">
          <Text color={COLORS.green}>  ✔ Account created & logged in!</Text>
          <Text color={COLORS.dim}>  Welcome aboard. You're ready to deploy.</Text>
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
