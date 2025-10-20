import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { ArrowLeft, Calculator, ScrollText } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg';
import { XP_MULTIPLIERS, GAME_CONSTANTS } from '@/types/xp-constants';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
// import ResultCard from '../common/ResultCard copy 2';
import ResultCard from '../common/ResultCard';

import { cn } from '@/lib/utils';
import CalculatorHeading from '../common/CalculatorHeading';

interface FriendshipInputs {
  good_friends: string;
  great_friends: string;
  ultra_friends: string;
  best_friends: string;
  lucky_egg: boolean;
}

interface FriendshipXPCalculatorProps {
  onBack: () => void;
}

export function FriendshipXPCalculator({ onBack }: FriendshipXPCalculatorProps) {
  const [inputs, setInputs] = useState<FriendshipInputs>({
    good_friends: '',
    great_friends: '',
    ultra_friends: '',
    best_friends: '',
    lucky_egg: false,
  });

  const calculateTotalXP = (): number => {
    let totalXP = 0;
    const goodFriends = Number.parseInt(inputs.good_friends) || 0;
    const greatFriends = Number.parseInt(inputs.great_friends) || 0;
    const ultraFriends = Number.parseInt(inputs.ultra_friends) || 0;
    const bestFriends = Number.parseInt(inputs.best_friends) || 0;

    totalXP += goodFriends * XP_MULTIPLIERS.friendship.good_friends;
    totalXP += greatFriends * XP_MULTIPLIERS.friendship.great_friends;
    totalXP += ultraFriends * XP_MULTIPLIERS.friendship.ultra_friends;
    totalXP += bestFriends * XP_MULTIPLIERS.friendship.best_friends;

    // Double XP if lucky egg is active
    if (inputs.lucky_egg) {
      totalXP *= 2;
    }

    return totalXP;
  };

  const handleNumberInput = (
    field: keyof Pick<
      FriendshipInputs,
      'good_friends' | 'great_friends' | 'ultra_friends' | 'best_friends'
    >,
    value: string
  ) => {
    // Allow empty string or valid numbers only
    if (value === '' || /^\d+$/.test(value)) {
      const int_value = parseInt(value) || 0;
      // Limit to 450
      if (int_value > GAME_CONSTANTS.MAX_FRIENDSHIP) {
        value = GAME_CONSTANTS.MAX_FRIENDSHIP.toString();
      }
      updateInput(field, value);
    }
  };

  const updateInput = (field: keyof FriendshipInputs, value: string | boolean) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const totalXP = calculateTotalXP();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const cardBorderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const inputBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const bg = isDark ? 'bg-black' : 'bg-background';
  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header */}
      <CalculatorHeading
        title="Friendship XP Calculator"
        description="Calculate XP from friendship levels"
        onBack={onBack}
      />
      <ScrollView contentContainerClassName="pb-8">
        {/* Calculator Content */}
        <View className="gap-6 px-6">
          {/* Lucky Egg Toggle */}
          <LuckyEggCard
            isActive={inputs.lucky_egg}
            onToggle={(checked) => updateInput('lucky_egg', checked)}
          />

          {/* Input Fields Card with Blur */}
          <Card className={`${cardBg} ${cardBorderColor}`}>
            <CardHeader className="pb-4">
              <CardTitle className="">
                <View className="flex-row items-center gap-2">
                  <ScrollText color="#ef4444" className="h-5 w-5 text-primary" />
                  <Text className="text-lg font-semibold text-foreground">Friendship Activities</Text>
                </View>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              {/* Good Friends */}
              <View className="gap-2">
                <Label nativeID="good_friends">Good Friends</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.good_friends}
                  onChangeText={(value) => handleNumberInput('good_friends', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.good_friends.toLocaleString()} XP each
                </Text>
              </View>
              {/* Great Friends */}
              <View className="gap-2">
                <Label nativeID="great_friends">Great Friends</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.great_friends}
                  onChangeText={(value) => handleNumberInput('great_friends', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.great_friends.toLocaleString()} XP each
                </Text>
              </View>

              {/* Ultra Friends */}
              <View className="gap-2">
                <Label nativeID="ultra_friends">Ultra Friends</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.ultra_friends}
                  onChangeText={(value) => handleNumberInput('ultra_friends', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.ultra_friends.toLocaleString()} XP each
                </Text>
              </View>

              {/* Best Friends */}
              <View className="gap-2">
                <Label nativeID="best_friends">Best Friends</Label>
                <TextInput
                  keyboardType="numeric"
                  value={inputs.best_friends}
                  onChangeText={(value) => handleNumberInput('best_friends', value)}
                  className={`rounded-lg p-3 ${inputBg} ${textPrimary} border ${borderColor}`}
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text className="text-xs text-muted-foreground">
                  +{XP_MULTIPLIERS.friendship.best_friends.toLocaleString()} XP each
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Results Card with Blur Background */}
          <ResultCard totalXP={totalXP} />
        </View>
      </ScrollView>
    </View>
  );
}