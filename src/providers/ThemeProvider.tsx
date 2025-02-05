import { PropsWithChildren } from 'react';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { theme } from '@/theme';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style="light" />
        {children}
      </View>
    </PaperProvider>
  );
} 