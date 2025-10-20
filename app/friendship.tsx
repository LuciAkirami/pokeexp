import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

interface FriendshipLevel {
  label: string;
  xp: number;
  value: number;
}

export default function FriendshipCalculator() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'light';

  const [friendshipLevels, setFriendshipLevels] = useState<FriendshipLevel[]>([
    { label: 'Good Friends', xp: 3000, value: 0 },
    { label: 'Great Friends', xp: 10000, value: 0 },
    { label: 'Ultra Friends', xp: 50000, value: 0 },
    { label: 'Best Friends', xp: 100000, value: 0 },
  ]);

  const calculateTotalXP = useCallback(() => {
    return friendshipLevels.reduce((total, level) => {
      return total + level.value * level.xp;
    }, 0);
  }, [friendshipLevels]);

  const updateFriendshipLevel = (index: number, value: string) => {
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    const newLevels = [...friendshipLevels];
    newLevels[index] = {
      ...newLevels[index],
      value: isNaN(numericValue) ? 0 : numericValue,
    };
    setFriendshipLevels(newLevels);
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-100'}`}>
      {/* Header */}
      <View className={`p-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={isDark ? '#ffffff' : '#171717'} />
          </TouchableOpacity>
          <View>
            <Text className={`text-lg font-bold ${isDark ? 'text-red-500' : 'text-red-500'}`}>
              Friendship XP Calculator
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Calculate XP from friendship levels
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Friendship Activities Card */}
        <View className={`mb-4 rounded-lg p-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <View className="mb-4 flex-row items-center gap-2">
            <Users size={24} color={isDark ? '#ef4444' : '#ef4444'} />
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Friendship Activities
            </Text>
          </View>

          {friendshipLevels.map((level, index) => (
            <View key={level.label} className="mb-4">
              <Text className={`mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {level.label}
              </Text>
              <TextInput
                className={`mb-1 h-12 rounded-lg px-4 ${
                  isDark ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-900'
                }`}
                keyboardType="numeric"
                value={level.value.toString()}
                onChangeText={(value) => updateFriendshipLevel(index, value)}
                placeholder="0"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
              />
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                +{level.xp.toLocaleString()} XP each
              </Text>
            </View>
          ))}
        </View>

        {/* Total XP Card */}
        <View className={`rounded-lg p-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} shadow-sm`}>
          <Text
            className={`mb-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Total XP Earned
          </Text>
          <Text className={`text-3xl font-bold ${isDark ? 'text-red-500' : 'text-red-500'}`}>
            {calculateTotalXP().toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
