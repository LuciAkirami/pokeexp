import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native';
import { ArrowLeft, Calculator } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LuckyEggCard } from '../common/LuckyEgg';
import { XP_MULTIPLIERS, GAME_CONSTANTS } from '@/types/xp-constants';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
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
  const styles = createStyles(isDark);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <CalculatorHeading title="Friendship XP Calculator" description="Calculate XP from friendship levels" onBack={onBack} />
      <ScrollView contentContainerClassName="pb-8">
        {/* Calculator Content */}
        <View className="gap-6 px-6">
          {/* Lucky Egg Toggle */}
          <LuckyEggCard
            isActive={inputs.lucky_egg}
            onToggle={(checked) => updateInput('lucky_egg', checked)}
          />

          {/* Input Fields Card with Blur */}
          <BlurView
            intensity={20}
            tint={isDark ? 'dark' : 'light'}
            className="overflow-hidden rounded-xl">
            <Card
              className={cn(
                'border-white/20 bg-white/5',
                isDark ? 'border-white/20 bg-white/5' : 'border-black/20 bg-white/20',
                ''
              )}>
              <CardHeader className="pb-4">
                <CardTitle className="flex-row items-center gap-2">
                  <Calculator size={20} color="#ef4444" />
                  <Text className="text-lg font-semibold text-foreground">
                    Friendship Activities
                  </Text>
                </CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                {/* Good Friends */}
                <View className="gap-2">
                  <Label nativeID="good_friends">Good Friends</Label>
                  <BlurView intensity={10} tint="dark" className="overflow-hidden rounded-md">
                    <TextInput
                      keyboardType="numeric"
                      value={inputs.good_friends}
                      onChangeText={(value) => handleNumberInput('good_friends', value)}
                      className="border border-white/20 bg-white/5 p-3 text-base text-foreground rounded-md"
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                    />
                  </BlurView>
                  <Text className="text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.good_friends.toLocaleString()} XP each
                  </Text>
                </View>
                {/* Great Friends */}
                <View className="gap-2">
                  <Label nativeID="great_friends">Great Friends</Label>
                  <BlurView intensity={10} tint="dark" className="overflow-hidden rounded-md">
                    <TextInput
                      keyboardType="numeric"
                      value={inputs.great_friends}
                      onChangeText={(value) => handleNumberInput('great_friends', value)}
                      className="border border-white/20 bg-white/5 p-3 text-base text-foreground rounded-md"
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                    />
                  </BlurView>
                  <Text className="text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.great_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Ultra Friends */}
                <View className="gap-2">
                  <Label nativeID="ultra_friends">Ultra Friends</Label>
                  <BlurView intensity={10} tint="dark" className="overflow-hidden rounded-md">
                    <TextInput
                      keyboardType="numeric"
                      value={inputs.ultra_friends}
                      onChangeText={(value) => handleNumberInput('ultra_friends', value)}
                      className="border border-white/20 bg-white/5 p-3 text-base text-foreground rounded-md"
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                    />
                  </BlurView>
                  <Text className="text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.ultra_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Best Friends */}
                <View className="gap-2">
                  <Label nativeID="best_friends">Best Friends</Label>
                  <BlurView intensity={10} tint="dark" className="overflow-hidden rounded-md">
                    <TextInput
                      keyboardType="numeric"
                      value={inputs.best_friends}
                      onChangeText={(value) => handleNumberInput('best_friends', value)}
                      className="border border-white/20 bg-white/5 p-3 text-base text-foreground rounded-md"
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                    />
                  </BlurView>
                  <Text className="text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.best_friends.toLocaleString()} XP each
                  </Text>
                </View>
              </CardContent>
            </Card>
          </BlurView>

          {/* Results Card with Blur Background */}
          <ResultCard totalXP={totalXP} />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
    },
    scrollContent: {
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      paddingBottom: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ef4444',
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#9ca3af' : '#6b7280',
      marginTop: 4,
    },
    main: {
      paddingHorizontal: 24,
      gap: 24,
    },
    card: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: 12,
      marginBottom: 24,
    },
    cardTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    cardTitleText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    inputGrid: {
      gap: 16,
    },
    inputWrapper: {
      gap: 8,
    },
    input: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: 8,
      padding: 12,
      color: isDark ? '#ffffff' : '#000000',
      fontSize: 16,
    },
    helperText: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    resultsCard: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.4)',
      borderRadius: 12,
    },
    resultsContent: {
      padding: 24,
    },
    resultsInner: {
      alignItems: 'center',
      gap: 8,
    },
    resultsLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#000000',
    },
    resultsValue: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#ef4444',
    },
  });