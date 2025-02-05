import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, HelperText, Portal, Modal } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { authService } from '@/services/api/auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      await authService.resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        error={!!error}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        error={!!error}
      />

      {error ? (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      ) : null}
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
        disabled={loading}
      >
        Login
      </Button>

      <Button
        mode="text"
        onPress={() => setResetModalVisible(true)}
        style={styles.forgotButton}
        textColor="#32CD32"
      >
        Forgot Password?
      </Button>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/register">
          <Text style={styles.link}>Register here</Text>
        </Link>
      </View>

      <Portal>
        <Modal
          visible={resetModalVisible}
          onDismiss={() => {
            setResetModalVisible(false);
            setResetSuccess(false);
            setResetError('');
            setResetEmail('');
          }}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            {resetSuccess ? 'Check Your Email' : 'Reset Password'}
          </Text>

          {!resetSuccess ? (
            <>
              <Text style={[styles.modalText, styles.marginBottom]}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>

              <TextInput
                label="Email"
                value={resetEmail}
                onChangeText={setResetEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                error={!!resetError}
              />

              {resetError ? (
                <HelperText type="error" visible={!!resetError}>
                  {resetError}
                </HelperText>
              ) : null}

              <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={resetLoading}
                disabled={resetLoading}
                style={styles.button}
              >
                Send Reset Link
              </Button>
            </>
          ) : (
            <>
              <Text style={[styles.modalText, styles.marginBottom]}>
                We've sent password reset instructions to your email address.
              </Text>

              <Button
                mode="contained"
                onPress={() => setResetModalVisible(false)}
                style={styles.button}
              >
                Close
              </Button>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#FFFFFF',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1A1A1A',
  },
  button: {
    marginTop: 10,
  },
  forgotButton: {
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#32CD32',
  },
  footerText: {
    color: '#FFFFFF',
  },
  modal: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  modalText: {
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
  marginBottom: {
    marginBottom: 20,
  },
}); 