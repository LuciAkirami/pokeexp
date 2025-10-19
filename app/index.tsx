import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import {
  BarChart3,
  Egg,
  Heart,
  MoonStarIcon,
  Shuffle,
  SunIcon,
  Sword,
  Zap,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import EnhancedCalculatorCard from './components/xp-calculator-card';

const SCREEN_OPTIONS = {
  headerTitle: () => <GradientHeaderTitle />,
  headerTransparent: false,
  headerRight: () => <ThemeToggle />,
};

function GradientHeaderTitle() {
  return (
    <MaskedView
      maskElement={<Text className="bg-transparent text-2xl font-bold">Poke Exp Calculator</Text>}>
      <LinearGradient
        colors={['#FF5722', '#E60073']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 8 }}>
        <Text className="text-2xl font-bold opacity-0">Poke Exp Calculator</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const calculators = [
    {
      id: 'detailed-xp',
      title: 'Detailed XP',
      subtitle: 'Between levels',
      description: 'Calculate XP between specific levels',
      icon: BarChart3,
      gradientColors: ['#ef4444', '#f43f5e'] as const,
      href: '/detailed-xp-calculator',
    },
    {
      id: 'catch-xp',
      title: 'Catch XP',
      subtitle: 'From catches',
      description: 'Calculate XP from catching Pokémon',
      icon: Zap,
      gradientColors: ['#b91c1c', '#dc2626'] as const,
      href: '/catch-xp-calculator',
    },
    {
      id: 'evolution-xp',
      title: 'Evolution XP',
      subtitle: 'From evolutions',
      description: 'Calculate XP from evolving Pokémon',
      icon: Shuffle,
      gradientColors: ['#e11d48', '#ef4444'] as const,
      href: '/evolution-xp-calculator',
    },
    {
      id: 'hatching-xp',
      title: 'Hatching XP',
      subtitle: 'From eggs',
      description: 'Calculate XP from hatching eggs',
      icon: Egg,
      gradientColors: ['#dc2626', '#e11d48'] as const,
      href: '/hatching-xp-calculator',
    },
    {
      id: 'raid-xp',
      title: 'Raid XP',
      subtitle: 'From raids',
      description: 'Calculate XP from raid battles',
      icon: Sword,
      gradientColors: ['#be123c', '#dc2626'] as const,
      href: '/raid-xp-calculator',
    },
    {
      id: 'max-battle-xp',
      title: 'Max Battle XP',
      subtitle: 'From Max Battles',
      description: 'Calculate XP from Max Battles',
      icon: Shield,
      gradientColors: ['#ef4444', '#b91c1c'] as const,
      href: '/max-battle-xp-calculator',
    },
    {
      id: 'max-moves-xp',
      title: 'Max Moves XP',
      subtitle: 'From Max Moves',
      description: 'Calculate XP from Max Moves',
      icon: Zap,
      gradientColors: ['#f43f5e', '#ef4444'] as const,
      href: '/max-moves-xp-calculator',
    },
    {
      id: 'friendship-xp',
      title: 'Friendship XP',
      subtitle: 'From friendships',
      description: 'Calculate XP from friendship levels',
      icon: Heart,
      gradientColors: ['#b91c1c', '#be123c'] as const,
      href: '/friendship-xp-calculator',
    },
  ];

  return (
    <View className="flex-1 flex-col">
      <Stack.Screen options={SCREEN_OPTIONS} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 16,
        }}>
        {calculators.map((calculator) => (
          <EnhancedCalculatorCard key={calculator.id} {...calculator} colorScheme={colorScheme} />
        ))}
      </ScrollView>
    </View>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
