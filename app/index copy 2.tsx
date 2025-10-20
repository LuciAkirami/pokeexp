import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Appearance } from 'react-native';
import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ChartLine,
  Sparkles,
  Sword,
  Egg,
  Swords,
  Shield,
  RotateCcw,
  Sun,
  Moon,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  // const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme preference from storage
  // useEffect(() => {
  //   const loadThemePreference = async () => {
  //     try {
  //       const savedTheme = 'l'
  //       if (savedTheme !== null) {
  //         setIsDarkMode(savedTheme === 'dark');
  //       } else {
  //         // Default to system preference
  //         const systemTheme = Appearance.getColorScheme();
  //         setIsDarkMode(systemTheme === 'dark');
  //       }
  //     } catch (error) {
  //       console.log('Error loading theme preference:', error);
  //       // Default to system preference
  //       const systemTheme = Appearance.getColorScheme();
  //       setIsDarkMode(systemTheme === 'dark');
  //     }
  //   };

  //   loadThemePreference();
  // }, []);

  // const toggleTheme = async () => {
  //   const newTheme = !isDarkMode;
  //   setIsDarkMode(newTheme);
  //   try {
  //     await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  //   } catch (error) {
  //     console.log('Error saving theme preference:', error);
  //   }
  // };

  const calculatorOptions = [
    {
      id: 'detailed',
      title: 'Detailed XP',
      subtitle: 'Between levels',
      description: 'Calculate XP between specific levels',
      icon: ChartLine,
    },
    {
      id: 'catch',
      title: 'Catch XP',
      subtitle: 'From catches',
      description: 'Calculate XP from catching Pokémon',
      icon: Sparkles,
    },
    {
      id: 'evolution',
      title: 'Evolution XP',
      subtitle: 'From evolutions',
      description: 'Calculate XP from evolving Pokémon',
      icon: Sword,
    },
    {
      id: 'hatching',
      title: 'Hatching XP',
      subtitle: 'From eggs',
      description: 'Calculate XP from hatching eggs',
      icon: Egg,
    },
    {
      id: 'raid',
      title: 'Raid XP',
      subtitle: 'From raids',
      description: 'Calculate XP from raid battles',
      icon: Swords,
    },
    {
      id: 'maxbattle',
      title: 'Max Battle XP',
      subtitle: 'From Max Battles',
      description: 'Calculate XP from Max Battles',
      icon: Shield,
    },
  ];

  // Theme-based styles
  const isDarkMode = true;
  const backgroundColor = isDarkMode ? 'bg-neutral-900' : 'bg-neutral-100';
  const headerBackgroundColor = isDarkMode ? 'bg-neutral-800' : 'bg-white';
  const textColorPrimary = isDarkMode ? 'text-white' : 'text-neutral-900';
  const textColorSecondary = isDarkMode ? 'text-neutral-400' : 'text-neutral-600';
  const textColorTertiary = isDarkMode ? 'text-neutral-500' : 'text-neutral-500';
  const cardBackgroundColor = isDarkMode ? 'bg-neutral-800' : 'bg-white';
  const borderColor = isDarkMode ? 'border-neutral-700' : 'border-neutral-200';
  const iconBackgroundColor = isDarkMode ? 'bg-red-500/20' : 'bg-red-100';
  const iconColor = '#ef4444';

  return (
    <View className={`flex-1 ${backgroundColor}`}>
      {/* Header */}
      <View className={`flex-row items-center justify-between px-4 py-6 ${headerBackgroundColor}`}>
        <Text className={`text-2xl font-bold text-red-500`}>Poke Exp Calculator</Text>
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4">
            {isDarkMode ? (
              <Sun color={iconColor} size={24} />
            ) : (
              <Moon color={iconColor} size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <RotateCcw color={iconColor} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 py-6">
        <Text className={`mb-2 text-3xl font-bold ${textColorPrimary}`}>Calculate Your</Text>
        <Text className={`mb-6 text-3xl font-bold text-red-500`}>Pokemon GO XP</Text>

        <Text className={`mb-6 ${textColorSecondary}`}>Select a calculator to get started</Text>

        {calculatorOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.id}
              className={`${cardBackgroundColor} mb-4 rounded-xl border p-4 active:opacity-80 ${borderColor}`}
              >
              <View className="mb-2 flex-row items-center">
                <View className={`${iconBackgroundColor} rounded-lg p-3`}>
                  <IconComponent size={24} color={iconColor} />
                </View>
                <View className="ml-4 flex-1">
                  <Text className={`text-lg font-semibold ${textColorPrimary}`}>
                    {option.title}
                  </Text>
                  <Text className={`text-sm ${textColorSecondary}`}>{option.subtitle}</Text>
                </View>
                <Text className={`text-2xl ${iconColor}`}>›</Text>
              </View>
              <Text className={`mt-2 text-sm ${textColorTertiary}`}>{option.description}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
