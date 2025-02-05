import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout() {

  return (
    <RecoilRoot>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(modals)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </RecoilRoot>
  );
} 