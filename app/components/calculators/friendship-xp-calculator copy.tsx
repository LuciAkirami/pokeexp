import React, { useState } from 'react';
import { ScrollView, View, Pressable, StyleSheet, TextInput } from 'react-native';
import { ArrowLeft, Calculator } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import MaskedView from '@react-native-masked-view/masked-view';
// import { LuckyEggCard } from '@/components/common/lucky-egg-card';
import { XP_MULTIPLIERS, GAME_CONSTANTS } from '@/types/xp-constants';

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
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

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

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 24,
          paddingBottom: 16,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Button onPress={onBack} size="icon" variant="ghost" className="rounded-full">
            <Icon as={ArrowLeft} className="text-primary" size={20} />
          </Button>
          <View style={{ flex: 1 }}>
            <MaskedView
              maskElement={
                <Text className="bg-transparent text-xl font-bold">Friendship XP Calculator</Text>
              }>
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text className="text-xl font-bold opacity-0">Friendship XP Calculator</Text>
              </LinearGradient>
            </MaskedView>
            <Text className="mt-1 text-sm text-muted-foreground">
              Calculate XP from friendship levels
            </Text>
          </View>
        </View>
      </View>

      {/* Calculator Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 20,
        }}>
        <View style={{ gap: 24 }}>
          {/* Lucky Egg Toggle */}
          {/* <LuckyEggCard
            isActive={inputs.lucky_egg}
            onToggle={(checked) => updateInput('lucky_egg', checked)}
          /> */}

          {/* Input Fields Card */}
          <View
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor:
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.25)',
              // Add shadow for better definition
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3, // For Android
            }}>
            <BlurView
              intensity={60}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 0,
                backgroundColor:
                  colorScheme === 'dark' ? 'transparent' : 'rgba(255, 255, 255, 0.7)',
              }}
            />
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
                  : ['rgba(0,0,0,0.03)', 'rgba(0,0,0,0.02)', 'rgba(0,0,0,0.01)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
              }}
            />

            <View style={{ padding: 24, zIndex: 2 }}>
              {/* Card Header */}
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Icon as={Calculator} className="text-primary" size={20} />
                <Text className="text-lg font-semibold text-foreground">Friendship Activities</Text>
              </View>

              {/* Input Fields */}
              <View style={{ gap: 16 }}>
                {/* Good Friends */}
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Good Friends</Text>
                  <TextInput
                    value={inputs.good_friends}
                    onChangeText={(value) => handleNumberInput('good_friends', value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colorScheme === 'dark' ? '#71717a' : '#a1a1aa'}
                    className="rounded-lg border border-white/20 bg-background/50 px-4 py-3 text-foreground"
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Text className="mt-1 text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.good_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Great Friends */}
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Great Friends</Text>
                  <TextInput
                    value={inputs.great_friends}
                    onChangeText={(value) => handleNumberInput('great_friends', value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colorScheme === 'dark' ? '#71717a' : '#a1a1aa'}
                    className="rounded-lg border border-white/20 bg-background/50 px-4 py-3 text-foreground"
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Text className="mt-1 text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.great_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Ultra Friends */}
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Ultra Friends</Text>
                  <TextInput
                    value={inputs.ultra_friends}
                    onChangeText={(value) => handleNumberInput('ultra_friends', value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colorScheme === 'dark' ? '#71717a' : '#a1a1aa'}
                    className="rounded-lg border border-white/20 bg-background/50 px-4 py-3 text-foreground"
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Text className="mt-1 text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.ultra_friends.toLocaleString()} XP each
                  </Text>
                </View>

                {/* Best Friends */}
                <View>
                  <Text className="mb-2 text-sm font-medium text-foreground">Best Friends</Text>
                  <TextInput
                    value={inputs.best_friends}
                    onChangeText={(value) => handleNumberInput('best_friends', value)}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={colorScheme === 'dark' ? '#71717a' : '#a1a1aa'}
                    className="rounded-lg border border-white/20 bg-background/50 px-4 py-3 text-foreground"
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Text className="mt-1 text-xs text-muted-foreground">
                    +{XP_MULTIPLIERS.friendship.best_friends.toLocaleString()} XP each
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Results Card */}
          <View
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: 'rgba(239, 68, 68, 0.4)',
            }}>
            <BlurView
              intensity={60}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 0,
                backgroundColor:
                  colorScheme === 'dark' ? 'transparent' : 'rgba(255, 255, 255, 0.7)',
              }}
            />
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)', 'transparent']
                  : ['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.08)', 'transparent']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: 1,
              }}
            />

            <View style={{ padding: 24, zIndex: 2, alignItems: 'center' }}>
              <Text className="mb-2 text-lg font-semibold text-foreground">Total XP Earned</Text>
              <MaskedView
                maskElement={
                  <Text
                    className="bg-transparent text-4xl font-bold"
                    style={{ textAlign: 'center' }}>
                    {totalXP.toLocaleString()}
                  </Text>
                }>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text className="text-4xl font-bold opacity-0" style={{ textAlign: 'center' }}>
                    {totalXP.toLocaleString()}
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
