import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {/* <Stack /> */}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="catch-xp-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="evolution-xp-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="hatching-xp-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="raid-xp-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="max-battle-xp-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="max-moves-xp-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="friendship-xp-calculator" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
      {/* <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          networkExtras: {
            collapsible: "bottom",
          }
        }}
        onAdFailedToLoad={(error) => console.log(error)}
      /> */}
    </ThemeProvider>
  );
}
