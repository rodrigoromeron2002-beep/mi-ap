import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { PlansProvider } from '@/contexts/PlansContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <SubscriptionProvider>
          <UserProfileProvider>
            <PlansProvider>
              <ProgressProvider>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="light" />
              </ProgressProvider>
            </PlansProvider>
          </UserProfileProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
